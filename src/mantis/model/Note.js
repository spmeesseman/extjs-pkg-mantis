
/**
 * @class Ext.ux.mantis.model.Note
 * 
 */
Ext.define('Ext.ux.mantis.model.Note', 
{
    extend: 'Ext.data.Model',    
    alias: 'mantis.model.note',
    
    requires: [
        'Ext.ux.mantis.model.User',
        'Ext.ux.mantis.model.ViewState'
    ],

    proxy:
    {
        type: 'memory'
    },

    fields: [
    { name: 'id',         type: 'number' },
    { name: 'type',       type: 'string' },
    { name: 'text',       type: 'string' },
    { name: 'created_at', type: 'date',    dateFormat: 'Y-m-dTH:i:s-u:00' },
    { name: 'updated_at', type: 'date',    dateFormat: 'Y-m-dTH:i:s-u:00' },
    { 
        name: 'reporter',
        reference: 
        {
            type: 'Ext.ux.mantis.model.User',
            role: 'reporter',
            unique: true
        }
    },
    { 
        name: 'view_state',
        reference: 
        {
            type: 'Ext.ux.mantis.model.ViewState',
            role: 'view_state',
            unique: true
        }
    },
    { 
        name: 'ticketid',               
        persist: false,
        reference:  // many-to-one
        {
            type: 'Ext.ux.mantis.model.Ticket',
            role: 'ticket',
            inverse: 
            {
                role: 'notes',  // role to match nest property name
                storeConfig:
                {
                    model: 'Ext.ux.mantis.model.Note'
                }
            }
        }
    }]

});
