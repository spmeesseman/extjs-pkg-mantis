/**
 * @class Ext.ux.mantis.Tickets
 * 
 */
Ext.define('Ext.ux.mantis.Tickets', 
{
    extend: 'Ext.tab.Panel',
    xtype: 'tickets',
    
    requires: [ 
        'Ext.ux.mantis.NewTicket',
        'Ext.ux.mantis.Ticket',
        'Ext.ux.mantis.TicketList'
    ],

    flex:1,
    border: false,
    
    options:
    {
        project_id: 1,
        project_name: "",
        token: "",
        versionIsPatchX: false,
        location: "",
        cb: null,
        newTicketRecord:null,
        defaultTicketValues:
        {
            priority: 30,
            severity: 50,
            reproducibility: 70,
            category: 1,
            custom_fields: [
            {
                field: 
                { 
                    name: "App User" 
                },
                value: ""
            },
            {
                field: 
                { 
                    name: "App Tag" 
                },
                value: ""
            }]
        },
        myTicketFilters: [
        {
            property: "custom_field_1" ,
            value: "App User"
        },
        {
            property: "custom_field_2",
            value: "App Tag"
        }],
        locationTicketFilters: [
        {
            property: "custom_field_2" ,
            value: "App Tag"
        }]
    },

    initComponent: function()
    {
        var me = this,
            record;

        if (me.options.newTicketRecord)
        {
            record = me.options.newTicketRecord;
        }
        else {
            record = Ext.ux.mantis.model.Ticket.create();
        }
        delete me.options.newTicketRecord;

        me.items = [
        {
            xtype: 'container',
            title: 'New Ticket',
            iconCls: 'far fa-ticket-alt',
            layout: 
            {
                type: 'vbox',
                align : 'stretch',
                pack  : 'start'
            },
            items: [
            {
                xtype: 'newticket',
                options: me.options,
                viewModel: {
                    data: {
                        record: record
                    }
                }
            }]
        },
        {
            xtype: 'container',
            title: 'My Tickets',
            iconCls: 'far fa-bars',
            layout: 
            {
                type: 'vbox',
                align : 'stretch',
                pack  : 'start'
            },
            items: [
            {
                xtype: 'ticketlist',
                options: me.options,
                params: {
                    type: 'all',
                    filters: Ext.util.JSON.encode(me.options.myTicketFilters)
                }
            }]
        },
        {
            xtype: 'container',
            title: 'My Open Tickets',
            iconCls: 'far fa-bars',
            layout: 
            {
                type: 'vbox',
                align : 'stretch',
                pack  : 'start'
            },
            items: [
            {
                xtype: 'ticketlist',
                options: me.options,
                params: {
                    type: 'open',
                    filters: Ext.util.JSON.encode(me.options.myTicketFilters)
                }
            }]
        },
        {
            xtype: 'container',
            title: 'My Closed Tickets',
            iconCls: 'far fa-bars',
            layout: 
            {
                type: 'vbox',
                align : 'stretch',
                pack  : 'start'
            },
            items: [
            {
                xtype: 'ticketlist',
                options: me.options,
                params: {
                    type: 'closed',
                    filters: Ext.util.JSON.encode(me.options.myTicketFilters)
                }
            }]
        },
        {
            xtype: 'container',
            title: 'Location Tickets',
            border: false,
            iconCls: 'far fa-bars',
            layout: 
            {
                type: 'vbox',
                align : 'stretch',
                pack  : 'start'
            },
            items: [
            {
                xtype: 'ticketlist',
                options: me.options,
                params: {
                    type: 'all',
                    filters: Ext.util.JSON.encode(me.options.locationTicketFilters)
                }
            }]
        }];

        me.callParent();
    }

});
