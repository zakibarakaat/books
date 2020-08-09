const BaseDocument = require('frappejs/model/document');
const LedgerPosting = require('../../../accounting/ledgerPosting');

module.exports = class JournalEntryServer extends BaseDocument {
  getPosting() {
    let entries = new LedgerPosting({ reference: this });

    for (let row of this.accounts) {
      if (row.debit) {
        entries.debit(row.account, row.debit);
      } else if (row.credit) {
        entries.credit(row.account, row.credit);
      }
    }

    return entries;
  }

  beforeUpdate() {
    this.getPosting().validateEntries();
  }

  beforeInsert() {
    this.getPosting().validateEntries();
  }

  async beforeSubmit() {
    await this.getPosting().post();
  }

  async afterRevert() {
    await this.getPosting().postReverse();
  }
};
