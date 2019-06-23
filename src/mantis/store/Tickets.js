Ext.define('Ext.ux.mantis.store.Tickets', 
{
    extend: 'Ext.ux.mantis.store.Base',
    alias: 'store.mantis.tickets',
    
    model: 'Ext.ux.mantis.model.Ticket',
    
    proxy: {
        type: 'rest',
        url: Ext.manifest.mantis.location ? Ext.manifest.mantis.location + 'api/rest/issues' : '',
        useDefaultXhrHeader: false,
        limitParam: 'page_size',
        headers:
        {
            Authorization: Ext.manifest.mantis.token
        },
        reader:
        {
            type: 'json',
            rootProperty: 'issues'
        },
        writer:
        {
            allDataOptions:
            {
                //critical: true,
                //changes: true,    
                persist: true,     // Default
                associated: true   // Override default false
            },
            partialDataOptions:
            {
                changes: true,     // Default
                critical: true,    // Default
                associated: true   // Override default false
            }
        }
    }

});


