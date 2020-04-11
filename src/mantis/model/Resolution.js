/**
 * @class Ext.ux.mantis.model.Resolution
 * 
 */
Ext.define('Ext.ux.mantis.model.Resolution', 
{
    extend: 'Ext.data.Model',    
    alias: 'mantis.model.resolution',
    
    fields: [
    { name: 'id',         type: 'number' },
    { name: 'name',       type: 'string' },
    { name: 'label',      type: 'string' }]

});
