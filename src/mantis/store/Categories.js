
Ext.define('Ext.ux.mantis.store.Categories', 
{
    extend: 'Ext.ux.mantis.store.Base',
    alias: 'store.mantis.categories',
    
    model: 'Ext.ux.mantis.model.Category',
    
    proxy: 
    {
        type: 'rest',
        url: Ext.manifest.mantis.location ? Ext.manifest.mantis.location + 'api/rest/projects' : '',
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
    }
    
});
