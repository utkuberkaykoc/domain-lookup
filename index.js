const whois = require('whois');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

/**
 * Reads domains from a file.
 * @param {string} filePath - Path to the file containing domain names.
 * @returns {Promise<string[]>} - Returns a list of domains.
 */
const readDomainsFromFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const domains = data.split('\n').map(domain => domain.trim()).filter(domain => domain.length > 0);
        resolve(domains);
      }
    });
  });
};

/**
 * Performs raw WHOIS lookup.
 * @param {string} domain - Domain name.
 * @returns {Promise<string>} - Raw WHOIS response.
 */
const rawWhois = (domain) => {
  return new Promise((resolve, reject) => {
    whois.lookup(domain, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

/**
 * Parses WHOIS data into structured fields.
 * @param {string} raw - Raw WHOIS text.
 * @returns {Object} - Parsed WHOIS fields.
 */
const parseWhoisData = (raw) => {
  const lines = raw.split('\n');
  const result = {};

  const fieldMap = {
    'Domain Name': 'domainName',
    'Registry Domain ID': 'registryDomainId',
    'Registrar WHOIS Server': 'registrarWhoisServer',
    'Registrar URL': 'registrarUrl',
    'Updated Date': 'updatedDate',
    'Creation Date': 'creationDate',
    'Registry Expiry Date': 'expiryDate',
    'Registrar Registration Expiration Date': 'expiryDate',
    'Registrar': 'registrar',
    'Registrar IANA ID': 'registrarIanaId',
    'Domain Status': 'domainStatus',
    'Name Server': 'nameServers',
    'DNSSEC': 'dnssec',
    'Registrant Organization': 'registrantOrganization',
    'Registrant Country': 'registrantCountry',
    'Registrant State/Province': 'registrantState',
    'Admin Email': 'adminEmail',
    'Tech Email': 'techEmail',
  };

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    const key = line.substring(0, colonIndex).trim();
    const value = line.substring(colonIndex + 1).trim();
    if (!key || !value) continue;

    const mappedKey = fieldMap[key];
    if (mappedKey) {
      if (mappedKey === 'nameServers' || mappedKey === 'domainStatus') {
        if (!result[mappedKey]) result[mappedKey] = [];
        result[mappedKey].push(value);
      } else if (!result[mappedKey]) {
        result[mappedKey] = value;
      }
    }
  }

  return result;
};

/**
 * Checks if a domain is available.
 * @param {string} domain - Domain name to check.
 * @returns {Promise<boolean>} - Returns true if available, false otherwise.
 */
const isAvailable = async (domain) => {
  const data = await rawWhois(domain);
  const notFoundPatterns = [
    'No match for domain',
    'NOT FOUND',
    'No match for',
    'Domain not found',
    'No Data Found',
    'Status: AVAILABLE',
    'No entries found',
  ];
  return notFoundPatterns.some(p => data.toUpperCase().includes(p.toUpperCase()));
};

/**
 * Gets detailed WHOIS information for a domain.
 * @param {string} domain - Domain name.
 * @returns {Promise<Object>} - Structured domain details.
 */
const getDomainDetails = async (domain) => {
  try {
    const raw = await rawWhois(domain);
    const available = [
      'No match for domain', 'NOT FOUND', 'No match for',
      'Domain not found', 'No Data Found', 'Status: AVAILABLE', 'No entries found',
    ].some(p => raw.toUpperCase().includes(p.toUpperCase()));

    if (available) {
      return {
        domain,
        available: true,
        message: `${domain} is available for registration!`,
      };
    }

    const parsed = parseWhoisData(raw);

    // Calculate days until expiry
    let daysUntilExpiry = null;
    let expiryWarning = null;
    if (parsed.expiryDate) {
      const expiry = new Date(parsed.expiryDate);
      const now = new Date();
      daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
      if (daysUntilExpiry < 0) expiryWarning = "⚠️ EXPIRED";
      else if (daysUntilExpiry <= 30) expiryWarning = "⚠️ Expiring soon!";
      else if (daysUntilExpiry <= 90) expiryWarning = "🔔 Expiring within 3 months";
    }

    // Calculate domain age
    let domainAge = null;
    if (parsed.creationDate) {
      const created = new Date(parsed.creationDate);
      const now = new Date();
      const years = Math.floor((now - created) / (1000 * 60 * 60 * 24 * 365.25));
      const months = Math.floor(((now - created) % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
      domainAge = `${years} years, ${months} months`;
    }

    return {
      domain,
      available: false,
      registrar: parsed.registrar || null,
      creationDate: parsed.creationDate || null,
      expiryDate: parsed.expiryDate || null,
      updatedDate: parsed.updatedDate || null,
      domainAge,
      daysUntilExpiry,
      expiryWarning,
      nameServers: parsed.nameServers || [],
      domainStatus: parsed.domainStatus || [],
      dnssec: parsed.dnssec || null,
      registrantOrganization: parsed.registrantOrganization || null,
      registrantCountry: parsed.registrantCountry || null,
    };
  } catch (error) {
    throw new Error(`WHOIS lookup failed for ${domain}: ${error.message}`);
  }
};

/**
 * Checks and prints domain availability with optional details.
 * @param {string} domain - Domain name to check.
 * @param {Object} [options] - Options.
 * @param {boolean} [options.detailed=false] - Show detailed WHOIS info.
 * @param {boolean} [options.json=false] - Return result as object instead of printing.
 * @returns {Promise<Object|void>}
 */
const checkDomain = async (domain, options = {}) => {
  try {
    if (options.detailed || options.json) {
      const details = await getDomainDetails(domain);
      if (options.json) return details;

      if (details.available) {
        console.log(chalk.green(`\n✅ ${chalk.bold(domain)}: Available for registration!\n`));
      } else {
        console.log(chalk.red(`\n❌ ${chalk.bold(domain)}: Not Available`));
        if (details.registrar) console.log(chalk.gray(`   📋 Registrar: ${details.registrar}`));
        if (details.creationDate) console.log(chalk.gray(`   📅 Created: ${details.creationDate}`));
        if (details.expiryDate) console.log(chalk.gray(`   ⏰ Expires: ${details.expiryDate}`));
        if (details.expiryWarning) console.log(chalk.yellow(`   ${details.expiryWarning} (${details.daysUntilExpiry} days)`));
        if (details.domainAge) console.log(chalk.gray(`   🕐 Age: ${details.domainAge}`));
        if (details.nameServers.length > 0) console.log(chalk.gray(`   🌐 NS: ${details.nameServers.join(', ')}`));
        console.log('');
      }
      return details;
    }

    const isDomainAvailable = await isAvailable(domain);
    const result = { domain, available: isDomainAvailable };

    if (options.json) return result;

    if (isDomainAvailable) {
      console.log(chalk.green(`\n${chalk.blue(domain)}: Available ✅\n`));
    } else {
      console.log(chalk.red(`\n${chalk.blue(domain)}: Not Available ❌\n`));
    }

    return result;
  } catch (error) {
    if (options.json) return { domain, error: error.message };
    console.error(chalk.red(`\nError: ${error.message}\n`));
  }
};

/**
 * Checks domains from a given file.
 * @param {string} filePath - Path to the file containing domain names.
 * @param {Object} [options] - Options.
 * @param {boolean} [options.detailed=false] - Show detailed WHOIS info.
 * @param {boolean} [options.json=false] - Return results as array.
 * @returns {Promise<Array|void>}
 */
const checkDomainsFromFile = async (filePath, options = {}) => {
  try {
    const domains = await readDomainsFromFile(filePath);
    const results = [];

    for (const domain of domains) {
      const result = await checkDomain(domain, options);
      results.push(result);
    }

    if (!options.json) {
      const available = results.filter(r => r && r.available).length;
      const unavailable = results.filter(r => r && !r.available && !r.error).length;
      console.log(chalk.yellow(`\n📊 Scanned ${domains.length} domains: ${chalk.green(`${available} available`)}, ${chalk.red(`${unavailable} taken`)}\n`));
    }

    return results;
  } catch (error) {
    if (options.json) throw error;
    console.error(chalk.red(`\nError: ${error.message}\n`));
  }
};

/**
 * Suggests alternative TLDs for a domain name.
 * @param {string} name - Domain name without TLD.
 * @param {string[]} [tlds] - TLDs to check.
 * @returns {Promise<Object[]>} - Array of { domain, available } objects.
 */
const suggestTLDs = async (name, tlds = ['.com', '.net', '.org', '.io', '.dev', '.app', '.co', '.xyz']) => {
  const results = [];
  for (const tld of tlds) {
    const domain = name.includes('.') ? name : `${name}${tld}`;
    try {
      const available = await isAvailable(domain);
      results.push({ domain, available });
    } catch {
      results.push({ domain, available: null, error: 'Lookup failed' });
    }
  }
  return results;
};

module.exports = {
  checkDomain,
  checkDomainsFromFile,
  getDomainDetails,
  isAvailable,
  suggestTLDs,
};
