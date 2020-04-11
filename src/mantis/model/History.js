/**
 * @class Ext.ux.mantis.model.History
 * 
 */
Ext.define('Ext.ux.mantis.model.History', 
{
    extend: 'Ext.data.Model',    
    alias: 'mantis.model.history',
    
    fields: [
    { name: 'message',       type: 'string' },
    { name: 'created_at',    type: 'date',    dateFormat: 'm/d/Y H:i:s' },
    { 
        name: 'type',     
        type: 'string' 
    },
    { 
        name: 'user',     
        type: 'string' 
    }]

});