
Ext.define('Ext.ux.mantis.store.Categories', 
{
    extend: 'Ext.data.Store',
    alias: 'store.mantis.categories',
    
    model: 'Ext.ux.mantis.model.Category',
    autoLoad: true,
    
    proxy: 
    {
        type: 'rest',
        url: 'https://app1.development.pjats.com/projects/api/rest/projects',
        useDefaultXhrHeader: false,
        params:
        {
            project_id: Ext.manifest.mantis.project_id
        },
        headers:
        {
            Authorization: Ext.manifest.mantis.token
        },
        reader:
        {
            type: 'json',
            rootProperty: function(data) {
                for (var p in data.projects) {
                    if (data.projects[p].id == Ext.manifest.mantis.project_id) {
                        return data.projects[p].categories;
                    }
                }
                return data.projects[0].categories;
            }
        }
    },
    
    listeners:
    {
        // eslint-disable-next-line consistent-return
        beforeload: function(store, operation, eopts)
        {
            if (!Ext.manifest.mantis.token || !Ext.manifest.mantis.project_id) {
                return false;
            }

            //
            // Set authorization header and config field name in proxy
            //
            try
            {
                var proxy = store.getProxy();

                proxy.setHeaders(
                {
                    Authorization: Ext.manifest.mantis.token
                });
                
                proxy.setExtraParams({ project_id: Ext.manifest.mantis.project_id });
            }
            catch(e) {}
        }
    }
    
});
