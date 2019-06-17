
Ext.define('Ext.us.mantis.model.Ticket', 
{
    extend: 'Ext.data.Model',    
    alias: 'mantis.model.ticket',
    
    fields: [
    { name: 'id',            type: 'number' },
    { name: 'cc',            type: 'string' },
    { name: 'changetime',    type: 'date',    dateFormat: 'm/d/Y H:i:s' },
    { name: 'component',     type: 'string' },
    { name: 'description',   type: 'string' },
    { name: 'due_date',      type: 'date',    dateFormat: 'm/d/Y H:i:s' },
    { name: 'keywords',      type: 'string' },
    { name: 'milestone',     type: 'string' },
    { name: 'owner',         type: 'string' },
    { name: 'priority',      type: 'string' },
    { name: 'reporter',      type: 'string' },
    { name: 'resolution',    type: 'string' },
    { name: 'status',        type: 'string' },
    { name: 'summary',       type: 'string' },
    { name: 'ticketsboard',  type: 'string' },
    { name: 'time',          type: 'date',    dateFormat: 'm/d/Y H:i:s' },
    { name: 'type',          type: 'string' },
    { name: 'version',       type: 'string' },
    { name: '_ts',           type: 'string' }]

});
