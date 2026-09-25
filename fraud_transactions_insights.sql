-- Create Database
CREATE DATABASE fraud_detection;
USE fraud_detection;

-- Create the fraud_transactions table
CREATE TABLE fraud_transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(10,2) NOT NULL,
    transaction_hour INT NOT NULL CHECK (transaction_hour BETWEEN 0 AND 23),
    location VARCHAR(100) NOT NULL,
    device VARCHAR(100) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    account_age_days INT NOT NULL,
    num_transactions_last_24h INT NOT NULL,
    is_fraud BOOLEAN NOT NULL
);

-- Load data from CSV file (MySQL method)
LOAD DATA INFILE 'C:\\Users\\reddy\\Downloads\\FraudShield AI-Powered Fraud Detection System\\fraud_dataset_500.csv'
INTO TABLE fraud_transactions
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(amount, transaction_hour, location, device, transaction_type, account_age_days, num_transactions_last_24h, is_fraud);

-- ======================================================
-- ADVANCED COMPLEX FRAUD ANALYSIS QUERIES
-- ======================================================

-- 1. Fraud Rate by Location (Fraud Percentage Per Location)
SELECT 
    location, 
    COUNT(CASE WHEN is_fraud = TRUE THEN 1 END) * 100.0 / COUNT(*) AS fraud_rate_percentage,
    COUNT(*) AS total_transactions
FROM fraud_transactions
GROUP BY location
ORDER BY fraud_rate_percentage DESC
LIMIT 10;

-- 2. High-Risk Devices (Devices with Highest Fraud Occurrences)
SELECT 
    device, 
    COUNT(*) AS fraud_count,
    ROUND(AVG(amount), 2) AS avg_fraud_amount,
    MAX(amount) AS max_fraud_amount
FROM fraud_transactions
WHERE is_fraud = TRUE
GROUP BY device
ORDER BY fraud_count DESC
LIMIT 5;

-- 3. Fraud Peak Hours (Identifying Most Common Hours for Fraud)
SELECT 
    transaction_hour, 
    COUNT(*) AS fraud_count,
    ROUND(AVG(amount), 2) AS avg_fraud_amount
FROM fraud_transactions
WHERE is_fraud = TRUE
GROUP BY transaction_hour
ORDER BY fraud_count DESC;

-- 4. Suspicious Accounts (Accounts with Repeated Fraudulent Transactions)
SELECT 
    account_age_days, 
    COUNT(*) AS fraud_count,
    AVG(amount) AS avg_fraud_amount,
    COUNT(DISTINCT transaction_id) AS unique_fraud_transactions
FROM fraud_transactions
WHERE is_fraud = TRUE
GROUP BY account_age_days
HAVING COUNT(*) > 3
ORDER BY fraud_count DESC;

-- 5. Anomaly Detection: Transactions That Deviate from Normal Behavior
SELECT 
    transaction_id,
    amount,
    transaction_hour,
    location,
    device,
    transaction_type,
    num_transactions_last_24h
FROM fraud_transactions
WHERE amount > (SELECT AVG(amount) + 3 * STDDEV(amount) FROM fraud_transactions)
ORDER BY amount DESC
LIMIT 10;

-- 6. Risk Scoring for Transactions (Assigning a Fraud Risk Score)
SELECT 
    transaction_id,
    amount,
    transaction_hour,
    location,
    device,
    transaction_type,
    num_transactions_last_24h,
    CASE 
        WHEN is_fraud = TRUE THEN 100
        WHEN amount > (SELECT AVG(amount) + 2 * STDDEV(amount) FROM fraud_transactions) THEN 90
        WHEN transaction_hour IN (0, 1, 2, 3) THEN 80
        WHEN num_transactions_last_24h > 5 THEN 70
        ELSE 50
    END AS fraud_risk_score
FROM fraud_transactions
ORDER BY fraud_risk_score DESC
LIMIT 20;

-- 7. Correlation Between Account Age and Fraudulent Behavior
SELECT 
    account_age_days, 
    COUNT(*) AS total_transactions,
    COUNT(CASE WHEN is_fraud = TRUE THEN 1 END) AS fraud_transactions,
    COUNT(CASE WHEN is_fraud = TRUE THEN 1 END) * 100.0 / COUNT(*) AS fraud_percentage
FROM fraud_transactions
GROUP BY account_age_days
ORDER BY fraud_percentage DESC
LIMIT 10;

-- 8. Fraudulent Transactions By Type (Understanding Most Vulnerable Transaction Types)
SELECT 
    transaction_type, 
    COUNT(*) AS total_transactions,
    COUNT(CASE WHEN is_fraud = TRUE THEN 1 END) AS fraud_count,
    ROUND((COUNT(CASE WHEN is_fraud = TRUE THEN 1 END) * 100.0 / COUNT(*)), 2) AS fraud_rate
FROM fraud_transactions
GROUP BY transaction_type
ORDER BY fraud_rate DESC
LIMIT 10;

-- 9. Identify Devices Used for High-Value Fraud
SELECT 
    device, 
    COUNT(*) AS fraud_count,
    AVG(amount) AS avg_fraud_amount,
    SUM(amount) AS total_fraud_loss
FROM fraud_transactions
WHERE is_fraud = TRUE
GROUP BY device
ORDER BY total_fraud_loss DESC
LIMIT 5;

-- 10. Detect Unusual Fraud Patterns Based on Time and Amount
SELECT 
    transaction_hour, 
    AVG(amount) AS avg_amount,
    MAX(amount) AS max_amount,
    COUNT(CASE WHEN is_fraud = TRUE THEN 1 END) AS fraud_cases
FROM fraud_transactions
GROUP BY transaction_hour
HAVING COUNT(CASE WHEN is_fraud = TRUE THEN 1 END) > 5
ORDER BY max_amount DESC;
