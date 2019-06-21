Ext.define('Ext.ux.mantis.model.CustomField', 
{
    extend: 'Ext.data.Model',    
    alias: 'mantis.model.customfield',
    
    requires: [
        'Ext.ux.mantis.model.Ticket'
    ],

    fields: [
    { 
        name: 'field'
    },
    { name: 'value',       type: 'string' },
    { 
        name: 'ticketid',               
        persist: false,
        reference:  // many-to-one
        {
            type: 'Ticket',          // base model type
            role: 'ticket',          // default base model role name
            inverse: 
            {
                role: 'custom_fields',  // role to match nest property name
                storeConfig:
                {
                    model: 'Ext.ux.mantis.model.CustomField'
                }
            }
        }
    }]

});
