/**
 * @class Ext.ux.mantis.model.Project
 * 
 */
Ext.define('Ext.ux.mantis.model.Project', 
{
    extend: 'Ext.data.Model',    
    alias: 'mantis.model.project',
    
    fields: [
    { name: 'id',          type: 'number' },
    { name: 'name',        type: 'string' },
    { name: 'categories',  type: 'string' },
    { name: 'versions',    type: 'string' }]

});
