-- 002_stored_procs.sql
-- Simple stored procedures for deposit, withdraw and transfer

DROP PROCEDURE IF EXISTS deposit_amount;
CREATE PROCEDURE deposit_amount(IN acct INT, IN amt DECIMAL(15,2))
BEGIN
  UPDATE account SET balance = balance + amt WHERE account_id = acct;
  INSERT INTO `transaction` (account_id, type, amount, meta) VALUES (acct, 'deposit', amt, NULL);
END;

DROP PROCEDURE IF EXISTS withdraw_amount;
CREATE PROCEDURE withdraw_amount(IN acct INT, IN amt DECIMAL(15,2))
BEGIN
  UPDATE account SET balance = balance - amt WHERE account_id = acct AND balance >= amt;
  INSERT INTO `transaction` (account_id, type, amount, meta) VALUES (acct, 'withdraw', amt, NULL);
END;

DROP PROCEDURE IF EXISTS transfer_amount;
CREATE PROCEDURE transfer_amount(IN from_acct INT, IN to_acct INT, IN amt DECIMAL(15,2))
BEGIN
  DECLARE cur_balance DECIMAL(15,2);
  SELECT balance INTO cur_balance FROM account WHERE account_id = from_acct;
  IF cur_balance >= amt THEN
    UPDATE account SET balance = balance - amt WHERE account_id = from_acct;
    UPDATE account SET balance = balance + amt WHERE account_id = to_acct;
    INSERT INTO `transaction` (account_id, type, amount, meta) VALUES (from_acct, 'transfer', amt, JSON_OBJECT('to', to_acct));
    INSERT INTO `transaction` (account_id, type, amount, meta) VALUES (to_acct, 'transfer', amt, JSON_OBJECT('from', from_acct));
  END IF;
END;
