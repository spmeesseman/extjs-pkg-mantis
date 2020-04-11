/**
 * @class Ext.ux.mantis.TicketDetail
 * 
 */
Ext.define('Ext.ux.mantis.TicketDetail', 
{
    extend: 'Ext.panel.Panel',
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

    viewModel: 
    {
        data: {
            record: null
        }
    },

    layout: 
    {
        type: 'vbox',
        align : 'stretch',
        pack  : 'start'
    },
    
    items: [
    {
        xtype: 'ticketheader'
    },
    {
        cls: 'mantis-ticket-list-ticket-summary mantis-text-shadow-letterpress',
        bind: 
        {
            html: '{record.summary}'
        }
    },
    {
        cls: 'mantis-ticket-list-ticket-description',
        margin: '10 0 0 0',
        bind: 
        {
            html: '{record.description}'
        }
    },
    {
        cls: 'mantis-ticket-list-ticket-description',
        margin: '10 0 0 0',
        bind: 
        {
            hidden: '{!record.steps_to_reproduce}',
            html: '<b>Steps to reproduce:</b><br>{record.steps_to_reproduce}'
        }
    },
    {
        cls: 'mantis-ticket-list-ticket-description',
        margin: '10 0 0 0',
        bind: 
        {
            hidden: '{!record.additional_information}',
            html: '<b>Additional Information:</b><br>{record.additional_information}'
        }
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
                    source: '{record.notes}',
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
            renderer: function(value, metaData, record) 
            {  
                if (record._reporter) {
                    return record.getReporter().get('name');
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
            renderer: function(value, metaData, record) 
            {  
                return Utils.formatDateAndTime(value, GEMS.user.userpref().getAt(0).get('locale'));
            } 
        },
        { 
            text: 'Note',       
            dataIndex: 'text',
            wrap: true,
            flex : 1,
            renderer: function(value, metaData, record)
            {
                return '<div style="white-space:normal !important;">' + value + '</div>';
            }
        }]
    }]

});
