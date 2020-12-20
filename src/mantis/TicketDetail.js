/**
 * @class Ext.ux.mantis.TicketDetail
 * 
 */
Ext.define('Ext.ux.mantis.TicketDetail', 
{
    extend: 'Ext.Panel',
    xtype: 'ticketdetail',
    
    requires: [
        Ext.platformTags.desktop ? 'Ext.grid.Panel' : 'Ext.grid.Grid',
        'Ext.ux.mantis.TicketHeader'
    ],

    flex:1,
    border:false,
    bodyPadding: '10 10 10 10',
    cls: 'mantis-ticket-list-ticket-detail',
    iconCls: 'far fa-ticket-alt',

    config: {
        record: null
    },

    layout: 
    {
        type: 'vbox',
        align : 'stretch',
        pack  : 'start'
    },
    
    initComponent: function()
    {
        var record = this.getRecord();
        this.items = [
        {
            xtype: 'ticketheader',
            record: record,
            margin: '5 0 0 0',
            defaults: {
                bodyStyle: {
                    'font-size': '22px'
                }
            }
        },
        {
            cls: 'mantis-ticket-list-ticket-summary mantis-text-shadow-letterpress',
            margin: '15 0 0 0',
            html: record ? record.get('summary') : ''
        },
        {
            cls: 'mantis-ticket-list-ticket-description',
            margin: '10 0 0 0',
            html: record ? record.get('description') : ''
        },
        {
            cls: 'mantis-ticket-list-ticket-description',
            margin: '10 0 0 0',
            html: '<b>Steps to reproduce:</b><br>' + record.get('steps_to_reproduce'),
            hidden: record ? !record.get('steps_to_reproduce') : true
        },
        {
            cls: 'mantis-ticket-list-ticket-description',
            margin: '10 0 0 0',
            html: '<b>Additional Information:</b><br>' + record.get('additional_information'),
            hidden: record ? !record.get('additional_information') : true
        },
        {
            xtype: 'grid',
            title: 'Notes',
            margin: '10 0 0 0',
            emptyText: 'No notes to display',
            viewModel:
            {
                stores:
                {
                    publicnotes: 
                    {
                        source: record ? record.notes() : Ext.emptyStore,
                        filters: [
                            function(item) {
                                return item.getView_state().get('label') === 'public';
                            }
                        ]
                    }
                }
            },
            bind: 
            {
                store: '{publicnotes}'
            },
            columns: [
            { 
                text: 'Reporter',       
                dataIndex: 'reporter.name',
                flex : 0.3,
                filter: 'string',
                renderer: function(value, metaData, r) 
                {  
                    if (r._reporter) {
                        return r.getReporter().get('name');
                    }
                    return value;
                } 
            },
            { 
                text: 'Date',           
                dataIndex: 'created_at',       
                flex: 0.3, 
                xtype : 'datecolumn',
                filter: 'date',
                renderer: function(value) 
                {  
                    return Utils.formatDateAndTime(value);
                } 
            },
            { 
                text: 'Note',       
                dataIndex: 'text',
                wrap: true,
                flex : 1,
                renderer: function(value)
                {
                    return '<div style="white-space:normal !important;">' + value + '</div>';
                }
            }]
        }];

        this.callParent();
    }

});
