import { LightningElement, api, wire } from 'lwc';
import getFieldChangeHistory from '@salesforce/apex/FieldHistoryViewerController.getFieldChangeHistory';

export default class FieldHistoryViewer extends LightningElement {
  @api recordId;
  data;
  error;
  isLoading = true;

  columns = [
    { label: 'Changed On',
        fieldName: 'ChangedOn__c',
        type: 'date',
        typeAttributes: {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true }},
    { label: 'Field', fieldName: 'FieldName__c' },
    { 
      label: 'User', 
      fieldName: 'ChangedByUrl',  // url field
      type: 'url', 
      typeAttributes: { label: { fieldName: 'ChangedByName' }, target: '_blank' }
    },
    { label: 'Original  Value', fieldName: 'OldValue__c' },
    { label: 'New Value', fieldName: 'NewValue__c' }
  ];

  @wire(getFieldChangeHistory, { parentId: '$recordId' })
  wiredData({ error, data }) {
    this.isLoading = false;
    if (data) {
      this.data = data.map(item => {
        let copy = JSON.parse(JSON.stringify(item));
        copy.ChangedByName = (copy.ChangedBy__r && copy.ChangedBy__r.Name) ? copy.ChangedBy__r.Name : 'Unknown User';
        copy.ChangedByUrl = '/'+copy.ChangedBy__c; // build user record URL
        return copy;
      });
      this.error = null;
    } else if (error) {
      this.error = error.body.message;
      this.data = null;
    }
  }
}