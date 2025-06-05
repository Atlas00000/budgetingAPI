# **Product Requirement Document (PRD) for Budgeting API**

## **1\. Introduction**

* **Project Name**: Budgeting API  
* **Version**: 1.0  
* **Date**: June 4, 2025  
* **Author**: \[Your Name\]

This PRD defines the requirements for a Budgeting API, a backend service built with Express.js and SQLite, designed as a portfolio project to demonstrate mid-level backend development skills. The API enables users to manage expenses, set monthly budget limits, generate spending reports with CSV export, support multi-currency transactions, and ensure data security through encryption at rest. A simple vanilla HTML frontend with inline CSS, including a basic admin page, is included for demonstration, focusing on functionality without authentication or complex routing.

## **2\. Overview**

The Budgeting API is a backend service that facilitates personal or small business financial management. It allows users to track expenses, categorize them, set budget limits, generate detailed spending reports, and handle transactions in multiple currencies. Data security is ensured through encryption at rest. The API is accompanied by a minimal HTML frontend with inline CSS for quick feedback, including an admin page for managing categories or currencies. The project emphasizes functionality, simplicity, and industry best practices, avoiding over-engineering.

### **2.1 Objectives**

* Demonstrate proficiency in backend development using Express.js and SQLite.  
* Provide a functional budgeting tool with expense tracking, budget management, reporting, multi-currency support, and data security.  
* Ensure the API is modular, maintainable, and adheres to best practices for a portfolio project.

### **2.2 Scope**

* **In Scope**:  
  * Backend API with expense categorization, budget caps, spending reports, multi-currency support, and data encryption.  
  * Simple HTML frontend with inline CSS for demonstration, including an admin page.  
  * Fixed exchange rates for multi-currency support.  
* **Out of Scope**:  
  * User authentication or protected routing.  
  * Real-time exchange rate integration.  
  * Multi-user support (assumes single-user usage).  
  * Advanced frontend frameworks (e.g., React, Vue).  
  * Integration with external bank APIs.

## **3\. Target Audience**

* **Portfolio Audience**: Potential employers or clients evaluating backend development skills in financial calculations, data export, and security.  
* **Product Audience**: Individuals or small businesses managing personal or business finances.

## **4\. Key Features**

* **Expense Categorization**: Assign expenses to predefined or custom categories.  
* **Monthly Budget Caps**: Set spending limits for categories or overall monthly budgets.  
* **Spending Reports (CSV Export)**: Generate filterable spending reports, exportable as CSV.  
* **Multi-Currency Support**: Record expenses in various currencies, converting to a base currency for reporting.  
* **Data Encryption at Rest**: Secure all stored data using encryption.

## **5\. Functional Requirements**

### **5.1 Expense Management**

* Users can add, edit, and delete expenses.  
* Each expense includes:  
  * Date (e.g., "2025-06-04")  
  * Amount (positive number)  
  * Currency (e.g., USD, EUR)  
  * Category (from predefined or custom categories)  
  * Description (optional)  
* Validation ensures required fields are present and valid (e.g., correct date format, positive amount).

### **5.2 Category Management**

* Predefined categories (e.g., Food, Transportation, Housing) are seeded in the database.  
* Users can add custom categories.  
* Users can view all categories.

### **5.3 Budget Management**

* Users can set monthly budgets for specific categories or overall spending.  
* Budgets include:  
  * Category ID (null for overall budget)  
  * Month and year  
  * Amount (in base currency)  
* The API tracks spending against budgets and provides indicators (e.g., percentage used).

### **5.4 Reporting**

* Generate spending reports for a specified date range.  
* Reports include:  
  * Total spending  
  * Spending by category  
  * Comparison to budget limits (if set)  
* Support CSV export using a library like `json2csv`.  
* Reports convert all expenses to the base currency.

### **5.5 Multi-Currency Support**

* Support multiple currencies (e.g., USD, EUR, JPY).  
* Users set a base currency (e.g., USD).  
* Store fixed exchange rates in the database.  
* Convert expenses to the base currency for reporting using stored rates.  
* Allow manual updates to exchange rates.

### **5.6 Data Security**

* Encrypt the SQLite database at rest using `sqlcipher` or a similar library.  
* For this portfolio project, the encryption key may be hardcoded, with a note that production environments require secure key management (e.g., environment variables).

## **6\. Non-Functional Requirements**

* **Performance**: Handle typical single-user loads with minimal latency.  
* **Scalability**: Design for extensibility (e.g., potential multi-user support).  
* **Reliability**: Implement robust error handling, logging, and input validation.  
* **Maintainability**: Ensure clean, documented code following Express.js and Node.js best practices.  
* **Security**: Use parameterized queries to prevent SQL injection and validate all inputs.

## **7\. Data Model**

The SQLite database includes the following tables:

| Table | Fields |
| ----- | ----- |
| **Expenses** | `id` (INTEGER, PRIMARY KEY), `date` (TEXT), `amount` (REAL), `currency_code` (TEXT, references `Currencies.code`), `category_id` (INTEGER, references `Categories.id`), `description` (TEXT, optional) |
| **Categories** | `id` (INTEGER, PRIMARY KEY), `name` (TEXT), `is_predefined` (BOOLEAN, default TRUE) |
| **Budgets** | `id` (INTEGER, PRIMARY KEY), `category_id` (INTEGER, references `Categories.id`, NULL for overall), `month` (INTEGER), `year` (INTEGER), `amount` (REAL, in base currency) |
| **Currencies** | `id` (INTEGER, PRIMARY KEY), `code` (TEXT, e.g., "USD"), `exchange_rate_to_base` (REAL, e.g., 1.0 for base currency) |
| **Settings** | `id` (INTEGER, PRIMARY KEY), `base_currency` (TEXT, e.g., "USD") |

## **8\. API Endpoints**

The API exposes the following endpoints:

| Method | Endpoint | Description |
| ----- | ----- | ----- |
| GET | `/expenses` | List expenses (filters: date range, category) |
| POST | `/expenses` | Add a new expense |
| GET | `/expenses/:id` | Get a single expense |
| PUT | `/expenses/:id` | Update an expense |
| DELETE | `/expenses/:id` | Delete an expense |
| GET | `/categories` | List all categories |
| POST | `/categories` | Add a new category |
| GET | `/budgets` | List budgets (filters: month, year, category) |
| POST | `/budgets` | Set a new budget |
| PUT | `/budgets/:id` | Update a budget |
| DELETE | `/budgets/:id` | Delete a budget |
| GET | `/reports/spending` | Generate spending report (params: start\_date, end\_date, category\_id, format=json|csv) |
| GET | `/currencies` | List currencies with exchange rates |
| POST | `/currencies` | Add a new currency with exchange rate |
| PUT | `/currencies/:id` | Update exchange rate for a currency |
| GET | `/settings` | Get current settings (e.g., base\_currency) |
| PUT | `/settings` | Update settings (e.g., base\_currency) |

## **9\. Security Considerations**

* Use parameterized queries to prevent SQL injection.  
* Validate all inputs (e.g., valid dates, positive amounts).  
* Encrypt the SQLite database using `sqlcipher` or similar.  
* Hardcode encryption key for portfolio purposes, with a note for secure management in production.

## **10\. Testing Requirements**

* **Unit Tests**: Test each endpoint for functionality and edge cases.  
* **Integration Tests**: Verify critical flows (e.g., adding expenses, generating reports).  
* **Security Tests**: Confirm data encryption and decryption functionality.  
* **Error Handling**: Ensure endpoints handle invalid inputs gracefully.

## **11\. Deployment Considerations**

* Run locally with Node.js and SQLite for development and demonstration.  
* Deployable to platforms like Heroku, noting SQLite’s limitations for production (e.g., concurrency issues).

## **12\. Notes**

* The project demonstrates mid-level skills in:  
  * Financial calculations (currency conversion).  
  * Data export (CSV generation).  
  * Security basics (data encryption).  
* The frontend is minimal, using vanilla HTML with inline CSS, including an admin page for managing categories or currencies, without authentication.  
* Fixed exchange rates simplify multi-currency support, suitable for a portfolio project.

