/**
 * @class Ext.ux.mantis.model.Field
 * 
 */
Ext.define('Ext.ux.mantis.model.Field', 
{
    extend: 'Ext.data.Model',    
    alias: 'mantis.model.field',

    fieldName: null,

    fields: [
        { name: 'id',    type: 'number' },
        { name: 'name',  type: 'string' },
        { name: 'label', type: 'string' }        
    ],

    proxy:
    {
        type: 'memory'
    }

});
