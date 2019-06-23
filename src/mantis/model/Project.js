Ext.define('Ext.ux.mantis.model.Project', 
{
    extend: 'Ext.data.Model',    
    alias: 'mantis.model.project',
    
    fields: [
    { name: 'id',          type: 'number' },
    { name: 'name',        type: 'string' },
    { name: 'categories',  type: 'string' },
    { name: 'versions',    type: 'string' }],

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
            rootProperty: 'projects'
        }
    }

});
