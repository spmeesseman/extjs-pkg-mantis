/**
 * @class Ext.ux.mantis.TicketHeader
 * 
 */
Ext.define('Ext.ux.mantis.TicketHeader', 
{
    extend: 'Ext.panel.Panel',
    xtype: 'ticketheader',

    listeners:
    {
        render: function(panel) 
        {
            var color = '#b295af';
            var record = panel.up().getViewModel().get('record');
            
            if (record.data.tags && record.data.tags.length > 0) 
            {
                for (var tag in record.data.tags) 
                {
                    if (!record.data.tags[tag].name) {
                        continue;
                    }

                    switch (record.data.tags[tag].name)
                    {
                        case "in progress":
                            color = "#56d37a";
                            break;
                        default:
                            color = "#4286f4";
                            break;
                    }
                    
                    panel.insert(1, 
                    {
                        margin: '0 5 0 0',
                        items: [
                        {
                            html: record.data.tags[tag].name,
                            bodyPadding: '3 5 3 5',
                            bodyStyle: 
                            {
                                'color': '#ffffff',
                                'background': color,
                                'text-align':'right',
                                'border-radius': '5px'
                            }
                        }]
                    });
                }
            }

            var typeSet = false;

            if (record.data.custom_fields && record.data.custom_fields.length > 0) 
            {
                var count = 0;

                for (var fld in record.data.custom_fields) 
                {
                    if (!record.data.custom_fields[fld].value) {
                        continue;
                    }

                    switch (record.data.custom_fields[fld].value)
                    {
                        case "bug":
                            typeSet = true;
                            color = "#f7274d";
                            break;
                        case "feature":
                            typeSet = true;
                            color = "#03b3c6";
                            break;
                        case "task":
                            typeSet = true;
                            color = "#309995";
                            break;
                        default:
                            switch (count)
                            {
                                case 0:
                                    color = '#a06ac4';
                                    break;
                                case 1:
                                    color = '#cf9eef';
                                    break;
                                case 2:
                                    color = '#c887f2';
                                    break;
                                default:
                                    color = "#b17ed3";
                                    break;
                            }
                            break;
                    }

                    panel.insert(1, 
                    {
                        margin: '0 5 0 0',
                        items: [
                        {
                            html: record.data.custom_fields[fld].value,
                            bodyPadding: '3 5 3 5',
                            bodyStyle: 
                            {
                                'color': '#ffffff',
                                'background': color,
                                'text-align':'right',
                                'border-radius': '5px'
                            }
                        }]
                    });

                    count++;
                }
            }

            if (!typeSet && record._severity)
            {
                var tagText = record.getSeverity().get('label');

                switch (tagText)
                {
                    case "feature":
                        color = "#03b3c6";
                        break;
                    default:
                        tagText = "bug";
                        color = '#f7274d';
                        break;
                }
                
                panel.insert(1, 
                {
                    margin: '0 5 0 0',
                    items: [
                    {
                        html: tagText,
                        bodyPadding: '3 5 3 5',
                        bodyStyle: 
                        {
                            'color': '#ffffff',
                            'background': color,
                            'text-align':'right',
                            'border-radius': '5px'
                        }
                    }]
                });
            }
        }
    },

    layout:
    {
        type: 'hbox',
        align: 'stretch',
        pack  : 'start'
    },
    bodyStyle: 
    {
        background: 'transparent'
    },
    items: [
    {
        flex: 1,
        cls: 'mantis-ticket-list-ticket-id mantis-text-shadow-letterpress',
        bind: 
        {
            html: '<span class="fal fa-ticket-alt"></span> Ticket #{record.id}'
        }
    },
    {
        margin: '0 10 0 0',
        items: [
        {
            bind: 
            {
                html: '{record.status.name}',
                bodyStyle: 
                {
                    'color': '#222222',
                    'background': '{record.status.color}',
                    'text-align':'right',
                    'border-radius': '5px'
                }
            },
            bodyPadding: '3 5 3 5'
        }]
    }]
});
