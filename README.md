# ExtJs Package Wrapper for MantisBT Rest API

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![app-publisher](https://app1.development.pjats.com/res/img/app-publisher-badge.svg)](https://npm.development.pjats.com/-/web/detail/@spmeesseman/app-publisher)

- [ExtJs Package Wrapper for MantisBT Rest API](#ExtJs-Package-Wrapper-for-MantisBT-Rest-API)
  - [Description](#Description)
  - [Install](#Install)
  - [Usage](#Usage)
  - [Configuration](#Configuration)
    - [Configuration - Parameter Definitions](#Configuration---Parameter-Definitions)

## Description

This package provides an ExtJS package wrapper for MantisBT integration, including a full tabbed ui.

## Install

To install this package, run the following command:

    npm install @spmeesseman/extjs-pkg-mantis

## Usage

To include the package in an ExtJS application build, be sure to add the package name to the list of required packages in the app.json file:

    "requires": [
        "mantis",
        ...
    ]

For an open tooling build, also add the node_modules path to the workspace.json packages path array:

     "packages": {
        "dir": "...${package.dir}/node_modules/@spmeesseman/extjs-pkg-mantis"
    }

Simply include the view component and model files into any class file:

    require: [ 
        'Ext.ux.mantis.Tickets',
        'Ext.ux.mantis.model.Ticket' 
    ]

Add the view to your layout:

    items: [
    {
        flex: 1,
        xtype: 'tickets'
    }]

Configure the ExtJs build for MantisBT integration, see the [Configuration](#Configuration) section for details.

## Configuration

A **mantis** config must be added to the Ext manifest by editing app.json.  For example, a sample mantis config would like something like the following:

    "mantis":
    {
        "project_id": 1,
        "project_name": "MyProjectName",
        "token": "............................",
        "versionIsPatchX": false,
        "location": "https://my.domain.com/mantisbt/",
        "defaultTicketValues":
        {
            "priority": 30,
            "severity": 50,
            "reproducibility": 70,
            "category": 1,
            "custom_fields": [
            {
                "field": 
                { 
                    "name": "User" 
                },
                "value": ""
            },
            {
                "field": 
                { 
                    "name": "Department" 
                },
                "value": ""
            }]
        },
        "myTicketFilters": [
        {
            "property": "custom_field_3" ,
            "value": ""
        },
        {
            "property": "custom_field_4",
            "value": ""
        }],
        "locationTicketFilters": [
        {
            "property": "custom_field_4" ,
            "value": ""
        }]
    }

### Configuration - Parameter Definitions

TODO
