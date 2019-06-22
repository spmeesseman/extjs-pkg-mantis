
Ext.define('Ext.ux.mantis.model.Ticket', 
{
    extend: 'Ext.data.Model',    
    alias: 'mantis.model.ticket',
    
    requires: [
        //'Ext.ux.mantis.Mantis',
        'Ext.ux.mantis.model.Category',
        'Ext.ux.mantis.model.Priority',
        'Ext.ux.mantis.model.Project',
        'Ext.ux.mantis.model.Reproducibility',
        'Ext.ux.mantis.model.Severity'
    ],

    proxy: {
        type: 'rest',
        url: 'https://app1.development.pjats.com/projects/api/rest/issues',
        useDefaultXhrHeader: false,
        limitParam: 'page_size',
        headers:
        {
            Authorization: Ext.manifest.mantis.token
        },
        reader:
        {
            type: 'json',
            rootProperty: 'issue'
        },
        writer:
        {
            allDataOptions:
            {
                //critical: true,
                //changes: true,    
                persist: true,     // Default
                associated: true,  // Override default false
                associatedSave: true     // Custom  (See override Model.js)
            },
            partialDataOptions:
            {
                changes: true,     // Default
                critical: true,    // Default
                associated: true,  // Override default false,
                droppedAssociated: true, // Custom (See override Model.js)
                associatedSave: true     // Custom  (See override Model.js)
            }
        }
    },
/*
    constructor:function()
    {
        var me = this;
        var data = arguments[0] || {};
        var tvs = Ext.manifest.mantis.defaultTicketValues;
            
        if (tvs)
        {
            for (var f in me.fields) 
            {
                if (tvs[me.fields[f].name]) {
                    //me.fields[f].defaultValue = tvs[me.fields[f].name]; //{ name: tvs[me.fields[f].name] };
                    //me.fields[f].set['me.fields[f].name']({})
                } 
            }
        }

        if (arguments.length === 0)
            this.callParent([data]);
        else
            this.callParent(arguments); 
    },
*/
    // eslint-disable-next-line consistent-return
    save: function(options)
    {
        var me = this;

        if (!Ext.manifest.mantis.token || !Ext.manifest.mantis.project_id) {
            return false;
        }
        
        if (me.phantom) {
            me.set('created_at', new Date());
            me.set('project', { id: Ext.manifest.mantis.project_id });
            if (Ext.manifest.mantis.defaultTicketValues.custom_fields) {
                me.set('custom_fields', Ext.manifest.mantis.defaultTicketValues.custom_fields);
            }
        }

        try
        {
            me.getProxy().setHeaders(
            {
                Authorization: Ext.manifest.mantis.token
            });
        }
        catch(e) {}

        //
        // Proceed to parent save()
        //
        me.callParent([options]);
    },

    fields: [
    { name: 'id' },
    { name: 'created_at',    type: 'date',   dateFormat: 'm/d/Y H:i:s' },
    { name: 'updated_at',    type: 'date',   dateFormat: 'm/d/Y H:i:s' },
    { name: 'sticky',        type: 'boolean' },
    { name: 'summary',       type: 'string'  },
    { name: 'description',   type: 'string'  },
    { 
        name: 'steps_to_reproduce',
        type: 'string'  
    },
    { 
        name: 'additional_information',
        type: 'string'  
    },{ 
        name: 'category',
        defaultValue: Ext.manifest.mantis && Ext.manifest.mantis.defaultTicketValues ? Ext.manifest.mantis.defaultTicketValues.category : 1,
        reference: 
        {
            type: 'Ext.ux.mantis.model.Category',
            role: 'category',
            unique: true
        }
    },
    { 
        name: 'custom_fields' 
    },
    { 
        name: 'handler'
    },
    { 
        name: 'notes' 
    },
    { 
        name: 'priority',
        defaultValue: Ext.manifest.mantis && Ext.manifest.mantis.defaultTicketValues ? Ext.manifest.mantis.defaultTicketValues.priority : 30,
        reference: 
        {
            type: 'Ext.ux.mantis.model.Priority',
            role: 'priority',
            unique: true
        }
    },
    { 
        name: 'project',
        defaultValue: Ext.manifest.mantis.project_id,
        reference: 
        {
            type: 'Ext.ux.mantis.model.Project',
            role: 'project',
            unique: true
        }
    },
    { 
        name: 'reporter'
    },
    { 
        name: 'reproducibility',
        defaultValue: Ext.manifest.mantis && Ext.manifest.mantis.defaultTicketValues ? Ext.manifest.mantis.defaultTicketValues.reproducibility : 70,
        reference: 
        {
            type: 'Ext.ux.mantis.model.Reproducibility',
            role: 'reproducibility',
            unique: true
        }
    },
    { 
        name: 'resolution'
    },
    { 
        name: 'severity',
        defaultValue: Ext.manifest.mantis && Ext.manifest.mantis.defaultTicketValues ? Ext.manifest.mantis.defaultTicketValues.severity : 50,
        reference: 
        {
            type: 'Ext.ux.mantis.model.Severity',
            role: 'severity',
            unique: true
        }
    },
    { 
        name: 'status'
    },
    { 
        name: 'tags'
    },
    { 
        name: 'target_version'
    },
    { 
        name: 'version'
    },
    { 
        name: 'view_state'
    },
    { 
        name: 'history' 
    },
    {
        name: 'shortDescription', 
        convert: function(v, rec) 
        {
            if (rec.get('description') && rec.get('description').length > 300) {
                return rec.get('description').substring(0, 300) + '...';
            }
            return rec.get('description');
        },
        depends: ['description'],
        persist: false
    }]

});
