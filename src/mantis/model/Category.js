/**
 * @class Ext.ux.mantis.model.Category
 * 
 */
Ext.define('Ext.ux.mantis.model.Category', 
{
    extend: 'Ext.data.Model',    
    alias: 'mantis.model.category',
    
    fields: [
    { name: 'id',         type: 'number' },
    { name: 'name',       type: 'string' }],

    proxy:
    {
        type: 'memory'
    }

});
