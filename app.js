// Smart Utility Billing Assistant - Core JavaScript

class SmartBillingApp {
  constructor() {
    this.storageKey = "smartBillingData"
    this.init()
  }

  init() {
    this.loadData()
    this.setupTheme()
    this.setupNavigation()
    this.initializePage()
  }

  // Data Management
  loadData() {
    const stored = localStorage.getItem(this.storageKey)
    if (stored) {
      this.data = JSON.parse(stored)
    } else {
      this.data = this.getDefaultData()
      this.saveData()
    }
  }

  saveData() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data))
  }

  getDefaultData() {
    return {
      utilities: [
        {
          id: "electricity",
          name: "Electricity",
          provider: "Kenya Power",
          balance: 2500,
          dueDate: "2025-01-15",
          monthlyAmount: 3000,
          instalmentPaid: 1500,
          accountNumber: "123456789",
        },
        {
          id: "water",
          name: "Water",
          provider: "Nairobi Water",
          balance: 800,
          dueDate: "2025-01-20",
          monthlyAmount: 1200,
          instalmentPaid: 600,
          accountNumber: "WTR987654",
        },
        {
          id: "rent",
          name: "Rent",
          provider: "Property Manager",
          balance: 25000,
          dueDate: "2025-01-31",
          monthlyAmount: 25000,
          instalmentPaid: 0,
          accountNumber: "RENT001",
        },
        {
          id: "wifi",
          name: "Wi-Fi",
          provider: "Safaricom",
          balance: 2999,
          dueDate: "2025-01-10",
          monthlyAmount: 2999,
          instalmentPaid: 0,
          accountNumber: "SAF123456",
        },
      ],
      transactions: [
        {
          id: 1,
          date: "2024-12-15",
          utility: "Electricity",
          amount: 1500,
          method: "M-Pesa",
          status: "Completed",
          reference: "MP241215001",
        },
        {
          id: 2,
          date: "2024-12-10",
          utility: "Water",
          amount: 600,
          method: "Airtel Money",
          status: "Completed",
          reference: "AM241210001",
        },
      ],
      splits: [
        {
          id: 1,
          utility: "Electricity",
          totalAmount: 3000,
          participants: [
            { name: "John", share: 1000, paid: true },
            { name: "Mary", share: 1000, paid: false },
            { name: "Peter", share: 1000, paid: true },
          ],
          createdDate: "2024-12-01",
        },
      ],
      reminders: {
        enabled: true,
        daysBefore: 3,
        smartSuggestions: true,
      },
      settings: {
        theme: "light",
        notifications: true,
        currency: "KES",
      },
    }
  }

  // Theme Management
  setupTheme() {
    const savedTheme = this.data.settings?.theme || "light"
    document.documentElement.setAttribute("data-theme", savedTheme)

    const themeToggle = document.querySelector(".theme-toggle")
    if (themeToggle) {
      themeToggle.innerHTML = savedTheme === "light" ? "🌙" : "☀️"
      themeToggle.addEventListener("click", () => this.toggleTheme())
    }
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme")
    const newTheme = currentTheme === "light" ? "dark" : "light"

    document.documentElement.setAttribute("data-theme", newTheme)
    this.data.settings.theme = newTheme
    this.saveData()

    const themeToggle = document.querySelector(".theme-toggle")
    if (themeToggle) {
      themeToggle.innerHTML = newTheme === "light" ? "🌙" : "☀️"
    }
  }

  // Navigation
  setupNavigation() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html"
    const navLinks = document.querySelectorAll(".nav-link")

    navLinks.forEach((link) => {
      const href = link.getAttribute("href")
      if (href === currentPage || (currentPage === "" && href === "index.html")) {
        link.classList.add("active")
      }
    })
  }

  // Page-specific initialization
  initializePage() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html"

    switch (currentPage) {
      case "index.html":
      case "":
        this.initDashboard()
        break
      case "pay.html":
        this.initPaymentPage()
        break
      case "split.html":
        this.initSplitPage()
        break
      case "history.html":
        this.initHistoryPage()
        break
      case "settings.html":
        this.initSettingsPage()
        break
      case "ussd.html":
        this.initUSSDPage()
        break
    }
  }

  // Dashboard functionality
  initDashboard() {
    this.renderUtilityCards()
    this.renderReminders()
  }

  renderUtilityCards() {
    const container = document.getElementById("utility-cards")
    if (!container) return

    container.innerHTML = this.data.utilities
      .map((utility) => {
        const progressPercent = (utility.instalmentPaid / utility.monthlyAmount) * 100
        const isOverdue = new Date(utility.dueDate) < new Date()

        return `
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">${utility.name}</h3>
              <p class="card-subtitle">${utility.provider}</p>
            </div>
            <span class="badge ${isOverdue ? "badge-error" : "badge-success"}">
              ${isOverdue ? "Overdue" : "Active"}
            </span>
          </div>
          <div class="mb-4">
            <p><strong>Balance:</strong> KES ${utility.balance.toLocaleString()}</p>
            <p><strong>Due:</strong> ${new Date(utility.dueDate).toLocaleDateString()}</p>
            <p><strong>Account:</strong> ${utility.accountNumber}</p>
          </div>
          <div class="mb-4">
            <div class="flex justify-between items-center mb-2">
              <span>Instalment Progress</span>
              <span>${Math.round(progressPercent)}%</span>
            </div>
            <div class="progress ${progressPercent === 100 ? "progress-success" : ""}">
              <div class="progress-bar" style="width: ${progressPercent}%"></div>
            </div>
          </div>
          <a href="pay.html?utility=${utility.id}" class="btn btn-primary">Pay Now</a>
        </div>
      `
      })
      .join("")
  }

  renderReminders() {
    const container = document.getElementById("reminders")
    if (!container) return

    const upcomingBills = this.data.utilities.filter((utility) => {
      const dueDate = new Date(utility.dueDate)
      const today = new Date()
      const daysDiff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))
      return daysDiff <= this.data.reminders.daysBefore && daysDiff >= 0
    })

    if (upcomingBills.length === 0) {
      container.innerHTML = '<p class="text-center">No upcoming bills in the next few days.</p>'
      return
    }

    container.innerHTML = `
      <h3 class="mb-4">Smart Reminders</h3>
      ${upcomingBills
        .map(
          (bill) => `
        <div class="card mb-4">
          <p><strong>${bill.name}</strong> payment due in ${Math.ceil((new Date(bill.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} days</p>
          <p>Amount: KES ${bill.balance.toLocaleString()}</p>
          <a href="pay.html?utility=${bill.id}" class="btn btn-sm btn-primary">Pay Now</a>
        </div>
      `,
        )
        .join("")}
    `
  }

  // Payment functionality
  initPaymentPage() {
    this.populateUtilityDropdown()
    this.setupPaymentForm()
  }

  populateUtilityDropdown() {
    const select = document.getElementById("utility-select")
    if (!select) return

    // Check for pre-selected utility from URL
    const urlParams = new URLSearchParams(window.location.search)
    const preselectedUtility = urlParams.get("utility")

    select.innerHTML =
      '<option value="">Select Utility</option>' +
      this.data.utilities
        .map(
          (utility) =>
            `<option value="${utility.id}" ${preselectedUtility === utility.id ? "selected" : ""}>
          ${utility.name} - ${utility.provider} (KES ${utility.balance.toLocaleString()})
        </option>`,
        )
        .join("")
  }

  setupPaymentForm() {
    const form = document.getElementById("payment-form")
    if (!form) return

    form.addEventListener("submit", (e) => {
      e.preventDefault()
      this.processPayment()
    })
  }

  processPayment() {
    const utilityId = document.getElementById("utility-select").value
    const amount = Number.parseFloat(document.getElementById("amount").value)
    const method = document.querySelector('input[name="payment-method"]:checked')?.value

    if (!utilityId || !amount || !method) {
      this.showMessage("Please fill in all fields", "error")
      return
    }

    const utility = this.data.utilities.find((u) => u.id === utilityId)
    if (!utility) {
      this.showMessage("Utility not found", "error")
      return
    }

    if (amount > utility.balance) {
      this.showMessage("Amount exceeds outstanding balance", "error")
      return
    }

    // Update utility balance
    utility.balance -= amount
    utility.instalmentPaid += amount

    // Add transaction
    const transaction = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      utility: utility.name,
      amount: amount,
      method: method,
      status: "Completed",
      reference: this.generateReference(method),
    }

    this.data.transactions.unshift(transaction)
    this.saveData()

    this.showMessage(
      `Payment of KES ${amount.toLocaleString()} successful! Reference: ${transaction.reference}`,
      "success",
    )

    // Reset form
    document.getElementById("payment-form").reset()
    this.populateUtilityDropdown()
  }

  generateReference(method) {
    const prefix =
      {
        "M-Pesa": "MP",
        Airtel: "AM",
        "T-Kash": "TK",
        Airtime: "AT",
      }[method] || "TX"

    const date = new Date().toISOString().slice(2, 10).replace(/-/g, "")
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `${prefix}${date}${random}`
  }

  // Bill splitting functionality
  initSplitPage() {
    this.setupSplitForm()
    this.renderActiveSplits()
  }

  setupSplitForm() {
    const form = document.getElementById("split-form")
    if (!form) return

    // Populate utility dropdown
    const utilitySelect = document.getElementById("split-utility")
    if (utilitySelect) {
      utilitySelect.innerHTML =
        '<option value="">Select Utility</option>' +
        this.data.utilities
          .map((utility) => `<option value="${utility.name}">${utility.name} - ${utility.provider}</option>`)
          .join("")
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault()
      this.createSplit()
    })
  }

  createSplit() {
    const utility = document.getElementById("split-utility").value
    const totalAmount = Number.parseFloat(document.getElementById("total-amount").value)
    const participantsText = document.getElementById("participants").value
    const shareType = document.querySelector('input[name="share-type"]:checked')?.value

    if (!utility || !totalAmount || !participantsText || !shareType) {
      this.showMessage("Please fill in all fields", "error")
      return
    }

    const participantNames = participantsText
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name)

    if (participantNames.length < 2) {
      this.showMessage("Please enter at least 2 participants", "error")
      return
    }

    let participants
    if (shareType === "equal") {
      const shareAmount = totalAmount / participantNames.length
      participants = participantNames.map((name) => ({
        name,
        share: Math.round(shareAmount * 100) / 100,
        paid: false,
      }))
    } else {
      // For custom shares, we'll use equal for now but this could be enhanced
      const shareAmount = totalAmount / participantNames.length
      participants = participantNames.map((name) => ({
        name,
        share: Math.round(shareAmount * 100) / 100,
        paid: false,
      }))
    }

    const split = {
      id: Date.now(),
      utility,
      totalAmount,
      participants,
      createdDate: new Date().toISOString().split("T")[0],
    }

    this.data.splits.unshift(split)
    this.saveData()

    this.showMessage("Bill split created successfully!", "success")
    document.getElementById("split-form").reset()
    this.renderActiveSplits()
  }

  renderActiveSplits() {
    const container = document.getElementById("active-splits")
    if (!container) return

    if (this.data.splits.length === 0) {
      container.innerHTML = '<p class="text-center">No active splits found.</p>'
      return
    }

    container.innerHTML = this.data.splits
      .map((split) => {
        const paidCount = split.participants.filter((p) => p.paid).length
        const progressPercent = (paidCount / split.participants.length) * 100

        return `
        <div class="card mb-6">
          <div class="card-header">
            <div>
              <h3 class="card-title">${split.utility}</h3>
              <p class="card-subtitle">Total: KES ${split.totalAmount.toLocaleString()} • Created: ${new Date(split.createdDate).toLocaleDateString()}</p>
            </div>
            <span class="badge ${progressPercent === 100 ? "badge-success" : "badge-warning"}">
              ${paidCount}/${split.participants.length} Paid
            </span>
          </div>
          
          <div class="mb-4">
            <div class="flex justify-between items-center mb-2">
              <span>Payment Progress</span>
              <span>${Math.round(progressPercent)}%</span>
            </div>
            <div class="progress ${progressPercent === 100 ? "progress-success" : ""}">
              <div class="progress-bar" style="width: ${progressPercent}%"></div>
            </div>
          </div>

          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Participant</th>
                  <th>Share</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${split.participants
                  .map(
                    (participant, index) => `
                  <tr>
                    <td>${participant.name}</td>
                    <td>KES ${participant.share.toLocaleString()}</td>
                    <td>
                      <span class="badge ${participant.paid ? "badge-success" : "badge-warning"}">
                        ${participant.paid ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                    <td>
                      ${
                        !participant.paid
                          ? `<button class="btn btn-sm btn-success" onclick="app.markAsPaid(${split.id}, ${index})">Mark as Paid</button>`
                          : '<span class="text-success">✓ Completed</span>'
                      }
                    </td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      `
      })
      .join("")
  }

  markAsPaid(splitId, participantIndex) {
    const split = this.data.splits.find((s) => s.id === splitId)
    if (split && split.participants[participantIndex]) {
      split.participants[participantIndex].paid = true
      this.saveData()
      this.renderActiveSplits()
      this.showMessage("Payment marked as completed!", "success")
    }
  }

  // History functionality
  initHistoryPage() {
    this.renderTransactionHistory()
    this.setupHistoryFilters()
    this.setupExportButton()
  }

  renderTransactionHistory() {
    const container = document.getElementById("transaction-history")
    if (!container) return

    if (this.data.transactions.length === 0) {
      container.innerHTML = '<p class="text-center">No transactions found.</p>'
      return
    }

    container.innerHTML = `
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Utility</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Reference</th>
            </tr>
          </thead>
          <tbody>
            ${this.data.transactions
              .map(
                (transaction) => `
              <tr onclick="app.toggleTransactionDetails(${transaction.id})" style="cursor: pointer;">
                <td>${new Date(transaction.date).toLocaleDateString()}</td>
                <td>${transaction.utility}</td>
                <td>KES ${transaction.amount.toLocaleString()}</td>
                <td>${transaction.method}</td>
                <td>
                  <span class="badge ${transaction.status === "Completed" ? "badge-success" : "badge-warning"}">
                    ${transaction.status}
                  </span>
                </td>
                <td>${transaction.reference}</td>
              </tr>
              <tr id="details-${transaction.id}" class="hidden">
                <td colspan="6" class="expandable">
                  <strong>Transaction Details:</strong><br>
                  Reference: ${transaction.reference}<br>
                  Date: ${new Date(transaction.date).toLocaleString()}<br>
                  Status: ${transaction.status}<br>
                  ${transaction.notes ? `Notes: ${transaction.notes}` : ""}
                </td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `
  }

  toggleTransactionDetails(transactionId) {
    const detailsRow = document.getElementById(`details-${transactionId}`)
    if (detailsRow) {
      detailsRow.classList.toggle("hidden")
    }
  }

  setupHistoryFilters() {
    // This would be enhanced with actual filter functionality
    const filterForm = document.getElementById("filter-form")
    if (filterForm) {
      filterForm.addEventListener("submit", (e) => {
        e.preventDefault()
        // Filter logic would go here
        this.showMessage("Filters applied (demo)", "success")
      })
    }
  }

  setupExportButton() {
    const exportBtn = document.getElementById("export-csv")
    if (exportBtn) {
      exportBtn.addEventListener("click", () => this.exportCSV())
    }
  }

  exportCSV() {
    const headers = ["Date", "Utility", "Amount", "Method", "Status", "Reference"]
    const csvContent = [
      headers.join(","),
      ...this.data.transactions.map((t) => [t.date, t.utility, t.amount, t.method, t.status, t.reference].join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    this.showMessage("Transaction history exported successfully!", "success")
  }

  // Settings functionality
  initSettingsPage() {
    this.renderUtilityManagement()
    this.renderReminderSettings()
    this.setupResetButton()
  }

  renderUtilityManagement() {
    const container = document.getElementById("utility-management")
    if (!container) return

    container.innerHTML = `
      <h3 class="mb-4">Manage Utilities</h3>
      <div class="grid grid-2">
        ${this.data.utilities
          .map(
            (utility) => `
          <div class="card">
            <h4 class="card-title">${utility.name}</h4>
            <p class="card-subtitle">${utility.provider}</p>
            <p>Account: ${utility.accountNumber}</p>
            <p>Monthly: KES ${utility.monthlyAmount.toLocaleString()}</p>
            <div class="flex gap-4 mt-4">
              <button class="btn btn-sm btn-secondary" onclick="app.editUtility('${utility.id}')">Edit</button>
              <button class="btn btn-sm btn-error" onclick="app.removeUtility('${utility.id}')">Remove</button>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
      <button class="btn btn-primary mt-4" onclick="app.addUtility()">Add New Utility</button>
    `
  }

  renderReminderSettings() {
    const container = document.getElementById("reminder-settings")
    if (!container) return

    container.innerHTML = `
      <h3 class="mb-4">Reminder Settings</h3>
      <div class="card">
        <div class="form-group">
          <label class="form-label">
            <input type="checkbox" ${this.data.reminders.enabled ? "checked" : ""} 
                   onchange="app.toggleReminders(this.checked)"> 
            Enable Smart Reminders
          </label>
        </div>
        <div class="form-group">
          <label class="form-label">Days Before Due Date</label>
          <input type="number" class="form-input" value="${this.data.reminders.daysBefore}" 
                 onchange="app.updateReminderDays(this.value)" min="1" max="30">
        </div>
        <div class="form-group">
          <label class="form-label">
            <input type="checkbox" ${this.data.reminders.smartSuggestions ? "checked" : ""} 
                   onchange="app.toggleSmartSuggestions(this.checked)"> 
            Enable Smart Payment Suggestions
          </label>
        </div>
      </div>
    `
  }

  setupResetButton() {
    const resetBtn = document.getElementById("reset-data")
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to reset all demo data? This cannot be undone.")) {
          this.resetData()
        }
      })
    }
  }

  toggleReminders(enabled) {
    this.data.reminders.enabled = enabled
    this.saveData()
    this.showMessage(`Reminders ${enabled ? "enabled" : "disabled"}`, "success")
  }

  updateReminderDays(days) {
    this.data.reminders.daysBefore = Number.parseInt(days)
    this.saveData()
    this.showMessage(`Reminder days updated to ${days}`, "success")
  }

  toggleSmartSuggestions(enabled) {
    this.data.reminders.smartSuggestions = enabled
    this.saveData()
    this.showMessage(`Smart suggestions ${enabled ? "enabled" : "disabled"}`, "success")
  }

  resetData() {
    localStorage.removeItem(this.storageKey)
    this.data = this.getDefaultData()
    this.saveData()
    this.showMessage("Demo data has been reset successfully!", "success")

    // Refresh the current page
    setTimeout(() => {
      window.location.reload()
    }, 1500)
  }

  // USSD Simulator functionality
  initUSSDPage() {
    this.currentUSSDStep = "main"
    this.renderUSSDScreen()
    this.setupUSSDInput()
  }

  renderUSSDScreen() {
    const screen = document.getElementById("ussd-screen")
    if (!screen) return

    const screens = {
      main: `
        *123# Smart Billing
        
        1. Pay Bill
        2. Pay Instalment
        3. Split Bill
        4. View History
        5. Settings
        0. Exit
        
        Enter choice:
      `,
      payBill: `
        Pay Bill
        
        1. Electricity - KES 2,500
        2. Water - KES 800
        3. Rent - KES 25,000
        4. Wi-Fi - KES 2,999
        
        0. Back
        Enter choice:
      `,
      payInstalment: `
        Pay Instalment
        
        Choose utility:
        1. Electricity (50% paid)
        2. Water (50% paid)
        3. Rent (0% paid)
        4. Wi-Fi (0% paid)
        
        0. Back
        Enter choice:
      `,
      splitBill: `
        Split Bill
        
        1. Create New Split
        2. View Active Splits
        
        0. Back
        Enter choice:
      `,
      history: `
        Payment History
        
        Recent transactions:
        15/12 - Electricity - KES 1,500
        10/12 - Water - KES 600
        
        1. View More
        0. Back
        Enter choice:
      `,
      settings: `
        Settings
        
        1. Manage Utilities
        2. Reminder Settings
        3. Reset Data
        
        0. Back
        Enter choice:
      `,
    }

    screen.innerHTML = `
      <div class="ussd-menu">
        <pre>${screens[this.currentUSSDStep] || screens.main}</pre>
      </div>
    `
  }

  setupUSSDInput() {
    const input = document.getElementById("ussd-input")
    const sendBtn = document.getElementById("ussd-send")

    if (!input || !sendBtn) return

    const handleUSSDInput = () => {
      const choice = input.value.trim()
      this.processUSSDInput(choice)
      input.value = ""
    }

    sendBtn.addEventListener("click", handleUSSDInput)
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleUSSDInput()
      }
    })
  }

  processUSSDInput(choice) {
    switch (this.currentUSSDStep) {
      case "main":
        switch (choice) {
          case "1":
            this.currentUSSDStep = "payBill"
            break
          case "2":
            this.currentUSSDStep = "payInstalment"
            break
          case "3":
            this.currentUSSDStep = "splitBill"
            break
          case "4":
            this.currentUSSDStep = "history"
            break
          case "5":
            this.currentUSSDStep = "settings"
            break
          case "0":
            this.showUSSDMessage("Thank you for using Smart Billing!")
            return
          default:
            this.showUSSDMessage("Invalid choice. Try again.")
            return
        }
        break
      case "payBill":
      case "payInstalment":
      case "splitBill":
      case "history":
      case "settings":
        if (choice === "0") {
          this.currentUSSDStep = "main"
        } else {
          this.showUSSDMessage("Feature simulated. Returning to main menu...")
          setTimeout(() => {
            this.currentUSSDStep = "main"
            this.renderUSSDScreen()
          }, 2000)
          return
        }
        break
    }

    this.renderUSSDScreen()
  }

  showUSSDMessage(message) {
    const screen = document.getElementById("ussd-screen")
    if (screen) {
      screen.innerHTML = `
        <div class="ussd-menu">
          <pre>${message}</pre>
        </div>
      `
    }
  }

  // Utility functions
  showMessage(message, type = "success") {
    // Remove existing messages
    const existingMessages = document.querySelectorAll(".success-message, .error-message")
    existingMessages.forEach((msg) => msg.remove())

    const messageDiv = document.createElement("div")
    messageDiv.className = type === "success" ? "success-message" : "error-message"
    messageDiv.textContent = message

    // Insert after the first form or at the top of main content
    const target = document.querySelector("form") || document.querySelector(".main .container")
    if (target) {
      target.insertAdjacentElement("afterend", messageDiv)
    }

    // Auto-remove after 5 seconds
    setTimeout(() => {
      messageDiv.remove()
    }, 5000)
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.app = new SmartBillingApp()
})
