# Domain Lookup 🚀  

✅ **Free to use!**  
🌍 A powerful **domain intelligence tool** with WHOIS parsing, expiry tracking, TLD suggestions, and bulk scanning. Works as a **CLI tool** and **Node.js module**.

![NPM Version](https://img.shields.io/npm/v/domain-lookup?color=blue&style=flat-square)  
![Downloads](https://img.shields.io/npm/dt/domain-lookup?color=green&style=flat-square)  
![License](https://img.shields.io/npm/l/domain-lookup?style=flat-square)  

---

## 🆕 What's New in v2.0.0  

🔥 **Detailed WHOIS Parsing** – Get registrar, creation date, expiry date, nameservers, and more  
🔥 **Expiry Tracking** – See days until expiry with ⚠️ warnings for expiring domains  
🔥 **Domain Age** – Calculate how old a domain is  
🔥 **TLD Suggestions** – Check availability across `.com`, `.net`, `.io`, `.dev`, and more  
🔥 **JSON Output** – Programmatic return values for all functions  
🔥 **Improved Detection** – Better "not found" pattern matching across registrars  
🔥 **Scan Summary** – See how many domains are available vs taken in batch scans  

---

## 📦 Installation  

```sh
npm install -g domain-lookup
```

Or in a Node.js project:  
```sh
npm install domain-lookup
```

---

## 🚀 CLI Usage  

### 🔍 Quick Check  
```sh
domain-lookup google.com
```

### 📂 Bulk Check from File  
```sh
domain-lookup -f domains.txt
```

---

## 📜 Node.js API  

### Basic Availability Check  
```js
const { checkDomain, isAvailable } = require("domain-lookup");

// Simple boolean check
const available = await isAvailable("mycoolsite.com");
console.log(available); // true or false

// Check with console output
await checkDomain("google.com");
```

### 🔍 Detailed WHOIS Information  
```js
const { getDomainDetails } = require("domain-lookup");

const info = await getDomainDetails("google.com");
console.log(info);
```

**Example Output:**  
```json
{
  "domain": "google.com",
  "available": false,
  "registrar": "MarkMonitor Inc.",
  "creationDate": "1997-09-15T04:00:00Z",
  "expiryDate": "2028-09-14T04:00:00Z",
  "domainAge": "28 years, 5 months",
  "daysUntilExpiry": 927,
  "expiryWarning": null,
  "nameServers": ["ns1.google.com", "ns2.google.com"],
  "domainStatus": ["clientDeleteProhibited", "serverUpdateProhibited"],
  "dnssec": "unsigned",
  "registrantOrganization": "Google LLC",
  "registrantCountry": "US"
}
```

### 🌐 TLD Suggestions  
```js
const { suggestTLDs } = require("domain-lookup");

const suggestions = await suggestTLDs("myawesomeapp");
console.log(suggestions);
```

**Output:**  
```json
[
  { "domain": "myawesomeapp.com", "available": true },
  { "domain": "myawesomeapp.net", "available": true },
  { "domain": "myawesomeapp.io", "available": false },
  { "domain": "myawesomeapp.dev", "available": true }
]
```

### 📂 Bulk Check with JSON Results  
```js
const { checkDomainsFromFile } = require("domain-lookup");

const results = await checkDomainsFromFile("domains.txt", { json: true, detailed: true });
console.log(results); // Array of detailed domain objects
```

---

## 📜 API Reference  

| Function | Description |
|---|---|
| `isAvailable(domain)` | Returns `true`/`false` for domain availability |
| `checkDomain(domain, options?)` | Check with console output + optional JSON return |
| `getDomainDetails(domain)` | Full WHOIS details with parsed fields |
| `checkDomainsFromFile(path, options?)` | Bulk check from `.txt` file |
| `suggestTLDs(name, tlds?)` | Check availability across multiple TLDs |

**Options:** `{ detailed: boolean, json: boolean }`

---

## 🛠️ Contributing  
Contributions are welcome! Fork the repository, create a branch, make changes, and submit a PR. 🚀  

---

## 📜 License  
This project is licensed under the **MIT License**.  

---

## 🌟 Support & Contact  
- **GitHub Issues:** [Report Bugs or Request Features](https://github.com/utkuberkaykoc/domain-lookup/issues)  
- **Give a Star:** ⭐ If you like this package, consider giving it a star on GitHub!  

🚀 **Happy Domain Hunting!** 🌍✨  

