# 📘 Stock Portfolio Web App — User Guide

Welcome to your **Stock Portfolio Web Application**! This guide explains all features step-by-step in simple English.

---

## 📑 Table of Contents
1. [Logging In & Cloud Sync](#1-logging-in--cloud-sync)
2. [Holdings Tab (Your Stock Portfolio)](#2-holdings-tab-your-stock-portfolio)
3. [Funds Tab (Monthly Budget & Cash Deposits)](#3-funds-tab-monthly-budget--cash-deposits)
4. [Plan Tab (Buy Targets, Budget & Carry-Forward)](#4-plan-tab-buy-targets-budget--carry-forward)
5. [Watchlist Tab (Market Sectors & Stock Tracker)](#5-watchlist-tab-market-sectors--stock-tracker)
6. [Importing & Exporting CSV / Excel Data](#6-importing--exporting-csv--excel-data)

---

## 1. Logging In & Cloud Sync

### How to Sign In:
1. Open the website: [https://ravantech.netlify.app/](https://ravantech.netlify.app/)
2. Enter your **Username** and **Password** (e.g. `admin` / `admin`).
3. Click **Sign In**.

### Cloud Sync (Syncing Across Phone & Computer):
- At the top-right corner, look for the **🟢 Cloud Synced** badge.
- Clicking the badge opens **Cloud Settings**:
  - **Upload to Cloud**: Sends your latest changes to Firebase cloud database.
  - **Download from Cloud**: Downloads your data to any new device or browser.

---

## 2. Holdings Tab (Your Stock Portfolio)

The **Holdings** page tracks all the stocks you currently own.

### Top Summary Cards:
- **Total Portfolio Value**: The current market worth of all your stocks.
- **Total Invested**: The actual money you paid to purchase the shares.
- **Total Profit & Loss (P&L)**: Green for overall profit, red for loss.
- **Today's Change**: How much your portfolio gained or lost today.
- **🎁 Earned (Free) Stock**: The total value of free shares you acquired using booked profits.

---

### Step-by-Step: Adding a Stock Holding
1. Click the blue **`+ Add Holding`** button.
2. Fill in the details:
   - **Symbol**: Stock ticker (e.g. `RELIANCE`, `TCS`, `TATAMOTORS`).
   - **Company Name**: Optional company name.
   - **Exchange**: Select `NSE` or `BSE`.
   - **Quantity**: Number of shares you bought (e.g. `10`).
   - **Average Buy Price**: Price per share (e.g. `2450.00`).
   - **🎁 Earned / Free Stock Qty**: *(Optional)* Enter the number of shares bought using past profits.
3. Click **Save Holding**.

---

### Understanding Earned (Free) Stocks:
> **What is an Earned Stock?**
> If you buy 1,000 shares at ₹10 and sell at ₹12, you make ₹2,000 profit. If you use that ₹2,000 profit to buy 200 shares, those 200 shares cost you ₹0 from your pocket — they are **100% Free / Earned Shares**!

- **Partial Free Shares**: Shows a green badge: `🎁 200 Earned`.
- **100% Free Position**: Shows `🌟 100% Free` when the entire position was funded by profits.
- You can manually edit the **Earned Qty** anytime by clicking the ✏️ (Edit) button on any holding row.

---

## 3. Funds Tab (Monthly Budget & Cash Deposits)

The **Funds** page helps you deposit cash into your trading account and track your monthly budget.

### Top Summary Cards:
- **Monthly Target**: How much money you plan to save/invest each month (e.g. ₹25,000).
- **Total Funds Loaded**: All-time cash deposited into your trading account.
- **Total Invested**: Total cash used to buy stocks.
- **Available Balance**: Cash remaining in your account to buy more stocks.

---

### Step-by-Step: Adding Funds (Depositing Cash)
1. Go to the **Funds** tab.
2. Click **`+ Add Funds`**.
3. Enter:
   - **Date**: Date of deposit.
   - **Amount**: Cash deposited (e.g. `25000`).
   - **Note**: Description (e.g. `August Monthly Salary Investment`).
4. Click **Save Transaction**.

---

## 4. Plan Tab (Buy Targets, Budget & Carry-Forward)

The **Plan** page lets you set price targets for stocks you want to buy and manages your monthly budget automatically.

### Top Summary Cards:
- **Available Budget**: Your monthly target + unspent money carried forward from previous months.
- **Executed (Consumed)**: Money already spent on completed purchase plans this month.
- **Remaining Budget**: Unused budget still available for your upcoming plans.
- **Active Planned Value**: Total cash needed to buy the active plans on your list.

---

### Step-by-Step: Creating a Purchase Plan
1. Go to the **Plan** tab.
2. Click **`+ Add Plan`**.
3. Choose a category from your Watchlist OR type a stock symbol manually.
4. Enter:
   - **Quantity**: How many shares you want to buy.
   - **Target Price**: The price you are waiting for (e.g. ₹2,400).
   - **Priority**: 🔥 High, ⭐ Medium, or 🔹 Low.
   - **Target Month**: Month you want to execute (defaults to current month).
5. Click **Save Plan**.

---

### 🎯 Live Target Tracking (Buy Zone):
- When the live market price drops to or below your target price, a glowing green **`🎯 Buy Zone`** badge appears.
- Click **`⟳ Check Live Prices`** at any time to check prices for all planned stocks.

---

### Step-by-Step: Executing a Plan (Consuming Budget)
1. When you buy the stock at your target price, click the **`✓ Execute`** button next to that plan.
2. A confirmation box appears showing:
   - Total amount invested.
   - How much budget will be left for the month after execution.
3. Click **Confirm**:
   - The stock is automatically added to your **Holdings** tab.
   - The purchase amount is deducted from this month's budget.
   - The **Remaining Budget** updates immediately.

---

### 🔄 Unused Budget Carry-Forward:
> If your monthly budget is ₹25,000 and you only execute plans worth ₹10,000, the remaining **₹15,000 automatically carries forward** into the next month's available budget (making your next month's budget ₹40,000)!

---

## 5. Watchlist Tab (Market Sectors & Stock Tracker)

The **Watchlist** page organizes stocks by sector categories (NIFTY 50, NIFTY IT, NIFTY BANK, Auto, Pharma, FMCG, Metal, etc.).

### Step-by-Step: Loading Preset Sectors
1. Go to the **Watchlist** tab.
2. Click **`⚡ Load NIFTY Presets`**.
3. This automatically populates all top Indian stocks organized by industry.

### Viewing Sector Stocks:
1. Click on any category card (e.g. **NIFTY IT**).
2. A window opens showing all stocks in that sector with:
   - Live Market Price (LTP).
   - Daily % Gain / Loss.
   - 52-Week High and Low.
3. Click **`+ Plan`** to turn any watchlist stock into a purchase target.

---

## 6. Importing & Exporting CSV / Excel Data

You can easily import your existing stock holdings or watchlists from Excel or CSV files.

### In Holdings Tab:
1. Click **`Import CSV/Excel`**.
2. Download the sample template (**CSV** or **Excel**) if you want to see the column layout.
3. Drag and drop your broker file (Zerodha, Groww, AngelOne, Upstox, or standard CSV).
4. Review the preview and click **Confirm Import**.

---

## 📱 Quick Reference Summary

| Tab | Main Purpose | Key Actions |
|---|---|---|
| **Holdings** | Track owned stocks and P&L | Add Holding, Track Earned Shares, View Live P&L |
| **Funds** | Manage cash deposits & monthly target | Add Fund Deposit, View Cash Balance |
| **Plan** | Plan target purchases & consume monthly budget | Add Plan, Execute Plan, Track Carry-Forward Budget |
| **Watchlist** | Monitor sector stocks & find buy ideas | Load Presets, Import CSV, Add directly to Plan |
