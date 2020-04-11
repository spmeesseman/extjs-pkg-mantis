/**
 * @class Ext.ux.mantis.model.Status
 * 
 */
Ext.define('Ext.ux.mantis.model.Status', 
{
    extend: 'Ext.data.Model',    
    alias: 'mantis.model.status',
    
    fields: [
    { name: 'id',         type: 'number' },
    { name: 'name',       type: 'string' },
    { name: 'label',      type: 'string' },
    { name: 'color',      type: 'string' }]

});
