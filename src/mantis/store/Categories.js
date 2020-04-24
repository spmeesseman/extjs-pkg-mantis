/**
 * @class Ext.ux.mantis.store.Categories
 * 
 */
Ext.define('Ext.ux.mantis.store.Categories', 
{
    extend: 'Ext.ux.mantis.store.Base',
    alias: 'store.mantis.categories',
    
    model: 'Ext.ux.mantis.model.Category',
    
    listeners:
    {
        // eslint-disable-next-line consistent-return
        beforeload: function(store, operation, eopts)
        {
            store.getProxy().setReader(
            {
                type: 'json',
                rootProperty: function(data) {
                    for (var p in data.projects) {
                        if (data.projects[p].id == store.getOptions().project_id) {
                            return data.projects[p].categories;
                        }
                    }
                    return data.projects[0].categories;
                }
            });
        }
    },

    proxy: 
    {
        type: 'rest',
        url: 'api/rest/projects',
        useDefaultXhrHeader: false
    }
    
});
