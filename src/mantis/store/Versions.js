/**
 * @class Ext.ux.mantis.store.Versions
 * 
 */
Ext.define('Ext.ux.mantis.store.Versions', 
{
    extend: 'Ext.ux.mantis.store.Base',
    alias: 'store.mantis.versions',
    
    model: 'Ext.ux.mantis.model.Version',
    
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
                            return data.projects[p].versions;
                        }
                    }
                    return data.projects[0].versions;
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
