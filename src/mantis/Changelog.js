
Ext.define('Ext.ux.mantis.Changelog', 
{
    extend: 'Ext.Panel',
    xtype: 'mantischangelog',
    
    require: [
    ],
    
    reference: 'mantischangelog',
    scrollable: true,
    	
    config:
    {
        closeFn: false
    },

    publishes:
    {
        closeFn: true
    },

    layout: 
    {
        type: 'vbox',
        align : 'stretch',
        pack  : 'start'
    },

    viewModel:
    {
        data:
        {
            version: Ext.manifest.version,
            versions: undefined
        },

        stores:
        {
            versionStore:
            {
                type: 'array',
                fields:[ { name:'dsc' } ],
                data : '{versionArrays}'
            }
        },

        formulas:
        {
            versionArrays: 
            {
                get: function(get) 
                {
                    var arr = [];
                    var versions = get('versions');
                    for (var v in versions)
                    {
                        arr.push([versions[v]]);
                    }
                    return arr;
                }
            },

            prevVersionDisabled: 
            {
                get: function(get) 
                {
                    var versions = get('versions');
                    if (versions && versions.length > 0)
                    {
                        return versions[versions.length - 1] === get('version');
                    }
                    return true;
                }
            },

            nextVersionDisabled: 
            {
                get: function(get) 
                {
                    var versions = get('versions');
                    if (versions && versions.length > 0)
                    {
                        return versions[0] === get('version');
                    }
                    return true;
                }
            }
        }
    },

    listeners:
    {
        afterrender: function(panel)
        {
            var vm = panel.getViewModel();
            var mask = ToolkitUtils.mask(panel, 'Loading mantis changelog');

            //
            // Default to current version
            //
            vm.set('version', Ext.manifest.version); 

            //
            // Build utility version cache first
            //
            MantisUtils.buildVersionCache()
            .then(function(cache)
            {
                //
                // Now get changelog for the current version
                //
                vm.set('versions', cache);
                return panel.getChangeLog();
            })
            .then(function(cache)
            {
                ToolkitUtils.unmask(mask);
            })
            .catch(function()
            {
                ToolkitUtils.unmask(mask);
                Utils.alertError("Error retrieving changelog");
            });
        }
    },
    
    items: [
    {
        bind:
    	{
            html: '{content}',
            title: 'Version {version}'
    	}
    }],
    
    buttons: [
    {
        xtype: 'combo',
        fieldLabel: 'Version',
        displayField: 'dsc',
        valueField: 'dsc',
        editable: false,
        width: 130,
        labelWidth: 45,
        margin: '0 15 0 0',
        queryMode: 'local',
        bind:
        {
            value: '{version}',
            store: '{versionStore}'
        },
        listeners:
        {
            select: function(cmb)
            {
                cmb.up('mantischangelog').getChangeLog();
            }
        }
    },
    {
        text: 'Previous',
        iconCls: 'far fa-hand-point-left',
        bind:
        {
            disabled: '{prevVersionDisabled}'
        },
        handler: function(btn, eopts)
        {
            var panel = btn.up('mantischangelog');
            var vm = panel.getViewModel();
            vm.set('version', MantisUtils.getVersionPrevious(vm.get('version')));
            panel.getChangeLog();
        }
    },
    {
        text: 'Next',
        disabeld: true,
        iconCls: 'far fa-hand-point-right',
        bind:
        {
            disabled: '{nextVersionDisabled}'
        },
        handler: function(btn, eopts)
        {
            var panel = btn.up('mantischangelog');
            var vm = panel.getViewModel();
            vm.set('version', MantisUtils.getVersionNext(vm.get('version')));
            panel.getChangeLog();
        }
    },
    {
        text: 'Close',
        iconCls: 'far fa-times',
        hidden: true,
        bind:
        {
            hidden: '{!mantischangelog.closeFn}'
        },
        handler: function(btn, eopts)
        {
        	btn.up('mantischangelog').getCloseFn()(btn, eopts);
        }
    }],

    getChangeLog: function()
    {
        //
        // Get changelog for the version set in the view model
        //
        var vm = this.getViewModel();
        return new Ext.Promise(function(resolve, reject)
        {
            MantisUtils.getChangeLog(vm.get('version'))
            .then(function(content)
            {
                vm.set('content', content);
                resolve();
            })
            .catch(function()
            {
                reject();
            });
        });
    }
    
});
