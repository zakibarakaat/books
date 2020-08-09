const TransactionServer = require('../Transaction/TransactionServer');
const PurchaseInvoice = require('./PurchaseInvoiceDocument');
const LedgerPosting = require('../../../accounting/ledgerPosting');

class PurchaseInvoiceServer extends PurchaseInvoice {
  async getPosting() {
    let entries = new LedgerPosting({ reference: this, party: this.supplier });
    await entries.credit(this.account, this.baseGrandTotal);

    for (let item of this.items) {
      await entries.debit(item.account, item.baseAmount);
    }

    if (this.taxes) {
      for (let tax of this.taxes) {
        await entries.debit(tax.account, tax.baseAmount);
      }
    }
    entries.makeRoundOffEntry();
    return entries;
  }
}

// apply common methods from TransactionServer
Object.assign(PurchaseInvoiceServer.prototype, TransactionServer);

module.exports = PurchaseInvoiceServer;
