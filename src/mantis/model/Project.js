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
            rootProperty: 'projects'
        }
    }

});
