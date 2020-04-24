/**
 * @class Ext.ux.mantis.store.Tickets
 * 
 */
Ext.define('Ext.ux.mantis.store.Tickets', 
{
    extend: 'Ext.ux.mantis.store.Base',
    alias: 'store.mantis.tickets',
    
    model: 'Ext.ux.mantis.model.Ticket',
    
    listeners:
    {
        // eslint-disable-next-line consistent-return
        beforeload: function(store, operation, eopts)
        {
            store.getProxy().setUrl(store.getOptions().location + 'plugins/ApiExtend/api/issues/' + store.getOptions().project_name);
        }
    },

    proxy: {
        type: 'rest',
        useDefaultXhrHeader: false,
        limitParam: 'page_size',
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


