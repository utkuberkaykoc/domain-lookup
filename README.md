# Domain Lookup 🚀  

✅ **Free to use!**
🌍 A powerful **CLI** tool to check domain name availability using WHOIS. Supports checking **multiple domains** at the same time. Works both as a CLI tool and as a Node.js module.  

![NPM Version](https://img.shields.io/npm/v/domain-lookup?color=blue&style=flat-square)  
![Downloads](https://img.shields.io/npm/dt/domain-lookup?color=green&style=flat-square)  
![License](https://img.shields.io/npm/l/domain-lookup?style=flat-square)  

---

## 📦 Installation  

Install globally via **npm**:  
```sh
npm install -g domain-lookup
```

Or using **yarn**:  
```sh
yarn global add domain-lookup
```

Or install it in a Node.js project:  
```sh
npm install domain-lookup
```

---

## 🚀 Usage  

### 🔍 Check a Single Domain in CLI  
You can check the availability of a single domain using the following command:  
```sh
domain-lookup google.com
```

If the domain is available, you will see:
```sh
✅ google.com is Available!
```
If the domain is not available, you will see:
```sh
❌ google.com is Not Available!
```

---

## 📂 **Checking Multiple Domains at the Same Time in CLI**  
You can check multiple domains **at once** by providing a `.txt` file containing a list of domain names.  

### **Step 1: Create a `.txt` File**  
Create a text file (e.g., `domains.txt`) and list the domains you want to check, one per line:  
```
google.com
mywebsite.net
randomdomain.org
example.io
```

### **Step 2: Run the Command**  
Run the following command to check all domains listed in the file:  
```sh
domain-lookup -f domains.txt
```

### **Step 3: Get the Results**  
After running the command, you will see an output like this:  
```sh
✅ mywebsite.net is Available!
❌ google.com is Not Available!
✅ randomdomain.org is Available!
❌ example.io is Not Available!
```

📌 **This allows you to quickly scan multiple domains without having to check them one by one!** 🚀  

---

## 📜 Using in a Node.js Project  

### **Install the package**  
```sh
npm install domain-lookup
```

### **Import the module**  
```js
const { checkDomain, checkDomainsFromFile } = require("domain-lookup");
```

### **Check a single domain**  
```js
checkDomain("example.com")
  .then(() => console.log("Check complete!"))
  .catch(err => console.error("Error:", err));
```

### **Check multiple domains from a file**  
```js
checkDomainsFromFile("domains.txt")
  .then(() => console.log("Batch check complete!"))
  .catch(err => console.error("Error:", err));
```

📌 **You can now use `domain-lookup` in any Node.js project!** 🚀  

---

## 📜 API Reference  

### `checkDomain(domain)`  
Checks a single domain's availability.  

### `checkDomainsFromFile(filePath)`  
Checks multiple domains listed in a text file.  

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

🚀 **Happy Coding!** 🎮✨  

