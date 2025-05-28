// Apex Controller: FieldHistoryViewerController.cls
public with sharing class FieldHistoryViewerController {

    @AuraEnabled(cacheable=true)
    public static List<Field_Change_Archive__b> getFieldChangeHistory(String parentId) {
        if (String.isBlank(parentId)) {
            throw new AuraHandledException('ParentId is required');
        }

        DateTime changedBefore = DateTime.now();

        List<Field_Change_Archive__b> results = [
            SELECT FieldName__c, OldValue__c, NewValue__c, ChangedBy__c, ChangedBy__r.Name, ChangedOn__c
FROM Field_Change_Archive__b
WHERE ParentId__c = :parentId
AND ChangedOn__c <= :changedBefore
ORDER BY ParentId__c ASC,  ChangedOn__c DESC
LIMIT 100

        ];

        return results;
    }
}