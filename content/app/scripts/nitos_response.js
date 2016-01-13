var nitos_response = {
    "resource_response": {
        "resources": [
            {
                "name": "node016",
                "urn": "urn:publicid:IDN+omf:testserver+node+node016",
                "uuid": "c5e5c8e3-3bb5-4312-bece-876538cbce58",
                "resource_type": "node",
                "interfaces": [
                    {
                        "name": "node016:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node016:if0",
                        "uuid": "fd93710b-6a6f-445a-a00c-886cb26605e5",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "mac": "00:03:1D:07:98:18",
                        "description": "1 Gbps ethernet",
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+701bc1fa-358a-4796-8205-3dbda2c3cacb",
                                "uuid": "701bc1fa-358a-4796-8205-3dbda2c3cacb",
                                "resource_type": "ip",
                                "address": "10.0.1.16",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ]
          },
                    {
                        "name": "node016:if1",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node016:if1",
                        "uuid": "425203f9-27b6-4c3b-8a6a-1df8b5feaf5f",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "experimental",
                        "mac": "00:03:1D:07:98:19",
                        "description": "1 Gbps ethernet",
                        "link": {
                            "name": "link001",
                            "uuid": "fdf7e3d1-e8e0-4d58-8e40-a618c27bae0f",
                            "urn": "urn:publicid:IDN+omf:testserver+link+link001",
                            "resource_type": "link",
                            "exclusive": true,
                            "connects": [
                                {
                                    "name": "node016",
                                    "urn": "urn:publicid:IDN+omf:testserver+node+node016",
                                    "uuid": "c5e5c8e3-3bb5-4312-bece-876538cbce58",
                                    "resource_type": "node",
                                    "domain": "omf:nitos.indoor",
                                    "available": true,
                                    "exclusive": true,
                                    "hardware_type": "PC-Grid",
                                    "hostname": "node016",
                                    "ram": "1.8905 GB",
                                    "ram_type": "DIMM Synchronous",
                                    "hd_capacity": "59.6263 GB",
                                    "monitored": true,
                                    "gateway": "10.64.44.30"
                },
                                {
                                    "name": "usrp_ethernet_device001",
                                    "urn": "urn:publicid:IDN+omf:nitlab.indoor+lte_dongle+usrp_ethernet_device001",
                                    "uuid": "9ac90c6c-4d83-4252-b2b3-8910095394c4",
                                    "resource_type": "usrpethernetdevice",
                                    "domain": "omf:nitlab.indoor",
                                    "exclusive": true,
                                    "operating_frequency": "70 MHz - 6 GHz",
                                    "cpu_model": "Xilinx Spartan 6 XC6SLX150",
                                    "antennas": "tx0: 2.4-5 GHz, rx0: 2.4-5 GHz",
                                    "base_model": "B210",
                                    "vendor": "Ettus Research",
                                    "number_of_antennas": "SISO 1x1"
                }
              ]
                        }
          }
        ],
                "cpus": [
                    {
                        "urn": "urn:publicid:IDN+omf:testserver+cpu+b1991601-f796-4224-9070-04245e3ae77b",
                        "uuid": "b1991601-f796-4224-9070-04245e3ae77b",
                        "resource_type": "cpu",
                        "exclusive": true,
                        "node_id": 5,
                        "cpu_type": "Intel(R) Core(TM)2 Duo CPU P8400 @ 2.26GHz",
                        "cores": 2,
                        "threads": 2,
                        "cache_l1": "32 KB",
                        "cache_l2": "3 MB"
          }
        ],
                "cmc": {
                    "name": "node2:cm",
                    "urn": "urn:publicid:IDN+omf:testserver+cmc+node2:cm",
                    "uuid": "768833ed-d33e-4b8f-bea9-5024551a4b28",
                    "resource_type": "cmc",
                    "exclusive": true,
                    "mac": "09:A2:DA:0D:F1:01",
                    "ip": {
                        "urn": "urn:publicid:IDN+omf:testserver+ip+64909884-cc2d-4b88-b9bc-3585c215007e",
                        "uuid": "64909884-cc2d-4b88-b9bc-3585c215007e",
                        "resource_type": "ip",
                        "address": "10.1.0.16",
                        "netmask": "255.255.255.0",
                        "ip_type": "ipv4"
                    }
                },
                "usb_devices": [
                    {
                        "name": "lte_dongle001",
                        "urn": "urn:publicid:IDN+omf:nitlab.indoor+lte_dongle+lte_dongle001",
                        "uuid": "26d7d298-535e-422e-8366-5a9fb30c46c8",
                        "resource_type": "ltedongle",
                        "domain": "omf:nitlab.indoor",
                        "exclusive": true,
                        "node_id": 5,
                        "base_model": "E392",
                        "vendor": "Huawei",
                        "number_of_antennas": "MIMO 2x2",
                        "usb_version": 2
          }
        ]
      },
            {
                "name": "node002",
                "urn": "urn:publicid:IDN+omf:testserver+node+node002",
                "uuid": "70c23011-38de-4226-a6da-7d5825f64b06",
                "resource_type": "node",
                "interfaces": [
                    {
                        "name": "node002:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node002:if0",
                        "uuid": "fed7b66b-d8f1-4d4c-a3d9-b9747d09ca7b",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "mac": "00:03:2D:08:41:C0",
                        "description": "1 Gbps ethernet",
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+07439c37-d1c5-409e-ac97-90756894a7bc",
                                "uuid": "07439c37-d1c5-409e-ac97-90756894a7bc",
                                "resource_type": "ip",
                                "address": "10.0.1.2",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ]
          },
                    {
                        "name": "node002:if1",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node002:if1",
                        "uuid": "f39a880a-2f7b-4139-a433-03aae8fd5166",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "experimental",
                        "mac": "00:03:1D:07:98:19",
                        "description": "1 Gbps ethernet"
          }
        ],
                "cpus": [
                    {
                        "urn": "urn:publicid:IDN+omf:testserver+cpu+377fc127-e795-450e-bee9-37ccfc55be3f",
                        "uuid": "377fc127-e795-450e-bee9-37ccfc55be3f",
                        "resource_type": "cpu",
                        "exclusive": true,
                        "node_id": 12,
                        "cpu_type": "VIA Esther processor 1000MHz",
                        "cores": 1,
                        "threads": 1,
                        "cache_l1": "32 KB",
                        "cache_l2": "0 MB"
          }
        ],
                "cmc": {
                    "name": "node2:cm",
                    "urn": "urn:publicid:IDN+omf:testserver+cmc+node2:cm",
                    "uuid": "dac654bc-432a-4356-bcc1-d3dde53ea74b",
                    "resource_type": "cmc",
                    "exclusive": true,
                    "mac": "09:A2:DA:0D:F0:02",
                    "ip": {
                        "urn": "urn:publicid:IDN+omf:testserver+ip+a616bfa6-010a-4e55-a8af-8e6a0da726f1",
                        "uuid": "a616bfa6-010a-4e55-a8af-8e6a0da726f1",
                        "resource_type": "ip",
                        "address": "10.1.0.2",
                        "netmask": "255.255.255.0",
                        "ip_type": "ipv4"
                    }
                },
                "usb_devices": [
                    {
                        "name": "wimax_dongle001",
                        "urn": "urn:publicid:IDN+omf:nitlab.office+lte_dongle+wimax_dongle001",
                        "uuid": "e3f338fd-6a4a-4540-9299-b52a274a48f7",
                        "resource_type": "wimaxdongle",
                        "domain": "omf:nitlab.office",
                        "exclusive": true,
                        "node_id": 12,
                        "base_model": "UM6225",
                        "vendor": "Teltonika",
                        "number_of_antennas": "MIMO 2x2",
                        "usb_version": 2
          },
                    {
                        "name": "usrp_usb_device001",
                        "urn": "urn:publicid:IDN+omf:nitlab.indoor+lte_dongle+usrp_usb_device001",
                        "uuid": "3182ad66-9135-44fe-aae5-41915e7a5986",
                        "resource_type": "usrpusbdevice",
                        "domain": "omf:nitlab.indoor",
                        "exclusive": true,
                        "node_id": 12,
                        "base_model": "B210",
                        "vendor": "Ettus Research",
                        "number_of_antennas": "MIMO 2x2",
                        "usb_version": 3
          }
        ]
      },
            {
                "name": "node120",
                "urn": "urn:publicid:IDN+omf:testserver+node+node120",
                "uuid": "a67614e6-ca56-4700-97e9-a07e0f14a93a",
                "resource_type": "node",
                "interfaces": [
                    {
                        "name": "node120:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node120:if0",
                        "uuid": "80858d56-8e0c-4eb3-90c8-52a213f2ae08",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "mac": "00-03-1d-0d-4b-96",
                        "description": "1 Gbps ethernet",
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+fa305fab-52ee-42ab-b693-98dd9b350091",
                                "uuid": "fa305fab-52ee-42ab-b693-98dd9b350091",
                                "resource_type": "ip",
                                "address": "10.0.1.120",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ]
          },
                    {
                        "name": "node120:if1",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node120:if1",
                        "uuid": "2ecbadb7-4880-497e-a21c-d2e6795b39fb",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "experimental",
                        "mac": "00-03-1d-0d-4b-97",
                        "description": "1 Gbps ethernet"
          }
        ],
                "cpus": [
                    {
                        "urn": "urn:publicid:IDN+omf:testserver+cpu+53cbb0a5-c082-4e07-a00a-fd811f34f04a",
                        "uuid": "53cbb0a5-c082-4e07-a00a-fd811f34f04a",
                        "resource_type": "cpu",
                        "exclusive": true,
                        "node_id": 19,
                        "cpu_type": "AMD Geode LX800 @ 500 MHz",
                        "cores": 1,
                        "threads": 1,
                        "cache_l1": "0 KB",
                        "cache_l2": "0 MB"
          }
        ],
                "cmc": {
                    "name": "node120:cm",
                    "urn": "urn:publicid:IDN+omf:testserver+cmc+node120:cm",
                    "uuid": "75dbf3ca-c301-4afd-a535-8e6566d913e6",
                    "resource_type": "cmc",
                    "exclusive": true,
                    "mac": "09:A2:DA:0D:F1:20",
                    "ip": {
                        "urn": "urn:publicid:IDN+omf:testserver+ip+26fb3e24-448b-468b-9328-9581cc915a97",
                        "uuid": "26fb3e24-448b-468b-9328-9581cc915a97",
                        "resource_type": "ip",
                        "address": "10.1.0.120",
                        "netmask": "255.255.255.0",
                        "ip_type": "ipv4"
                    }
                },
                "leases": [
                    {
                        "urn": "urn:publicid:IDN+omf:testserver+lease+ddf0fe7a-5d86-462b-92eb-cd4f57812490",
                        "uuid": "ddf0fe7a-5d86-462b-92eb-cd4f57812490",
                        "resource_type": "lease",
                        "valid_from": "2016-01-12T18:00:00Z",
                        "valid_until": "2016-01-13T19:00:00Z",
                        "status": "accepted",
                        "client_id": "lease_1234",
                        "account": {
                            "name": "geni.gpo.gcf.testslice",
                            "urn": "urn:publicid:IDN+geni:gpo:gcf+slice+testslice",
                            "uuid": "43260bd4-4b42-4f41-9edf-079f492cbcfa",
                            "resource_type": "account",
                            "created_at": "2016-01-08T16:20:09Z",
                            "valid_until": "2016-01-08T17:20:45Z"
                        }
          }
        ]
      },
            {
                "name": "node121",
                "urn": "urn:publicid:IDN+omf:testserver+node+node121",
                "uuid": "fe4f8599-54b8-42e5-923e-9151baa2e5c4",
                "resource_type": "node",
                "interfaces": [
                    {
                        "name": "node121:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node121:if0",
                        "uuid": "77742d42-d10b-45ba-8daf-cec1354ca762",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "mac": "00-03-1d-0d-40-98",
                        "description": "1 Gbps ethernet",
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+701fd99f-9002-4303-b7f1-5e6cc4045c36",
                                "uuid": "701fd99f-9002-4303-b7f1-5e6cc4045c36",
                                "resource_type": "ip",
                                "address": "10.0.1.121",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ]
          },
                    {
                        "name": "node121:if1",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node121:if1",
                        "uuid": "10042b44-c01d-4195-9a63-8e73ecfae63f",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "experimental",
                        "mac": "00-03-1d-0d-40-99",
                        "description": "1 Gbps ethernet"
          }
        ],
                "cpus": [
                    {
                        "urn": "urn:publicid:IDN+omf:testserver+cpu+f008b53e-d5c5-4558-b7a7-87ac3658d621",
                        "uuid": "f008b53e-d5c5-4558-b7a7-87ac3658d621",
                        "resource_type": "cpu",
                        "exclusive": true,
                        "node_id": 26,
                        "cpu_type": "Intel(R) Core(TM) i7-3770 CPU @ 3.40GHz",
                        "cores": 4,
                        "threads": 8,
                        "cache_l1": "32 KB",
                        "cache_l2": "8 MB"
          }
        ],
                "cmc": {
                    "name": "node121:cm",
                    "urn": "urn:publicid:IDN+omf:testserver+cmc+node121:cm",
                    "uuid": "f245f7a3-bb85-45ef-b6d9-6ba8c1d21a51",
                    "resource_type": "cmc",
                    "exclusive": true,
                    "mac": "09:A2:DA:0D:F1:21",
                    "ip": {
                        "urn": "urn:publicid:IDN+omf:testserver+ip+e36d5c23-4eda-4f5c-ace7-183471225ab1",
                        "uuid": "e36d5c23-4eda-4f5c-ace7-183471225ab1",
                        "resource_type": "ip",
                        "address": "10.1.0.121",
                        "netmask": "255.255.255.0",
                        "ip_type": "ipv4"
                    }
                },
                "leases": [
                    {
                        "urn": "urn:publicid:IDN+omf:testserver+lease+36466bbb-919b-4f83-984e-6ee631d0a3e4",
                        "uuid": "36466bbb-919b-4f83-984e-6ee631d0a3e4",
                        "resource_type": "lease",
                        "valid_from": "2016-01-12T18:00:00Z",
                        "valid_until": "2016-01-13T19:00:00Z",
                        "status": "accepted",
                        "client_id": "lease_2345",
                        "account": {
                            "name": "geni.gpo.gcf.testslice",
                            "urn": "urn:publicid:IDN+geni:gpo:gcf+slice+testslice",
                            "uuid": "43260bd4-4b42-4f41-9edf-079f492cbcfa",
                            "resource_type": "account",
                            "created_at": "2016-01-08T16:20:09Z",
                            "valid_until": "2016-01-08T17:20:45Z"
                        }
          }
        ]
      },
            {
                "name": "android.351746051215906",
                "urn": "urn:publicid:IDN+omf:testserver+node+android.351746051215906",
                "uuid": "0f89bf4b-7210-4f07-a5a6-f2bb441b42a5",
                "resource_type": "node",
                "sliver_type": {
                    "name": "mobile_phone",
                    "urn": "urn:publicid:IDN+omf:testserver+slivertype+mobile_phone",
                    "uuid": "88ff3b5c-4006-4d51-aa33-894e8bd4bacd",
                    "resource_type": "slivertype",
                    "disk_image_id": 31
                }
      },
            {
                "name": "android.354390050711461",
                "urn": "urn:publicid:IDN+omf:testserver+node+android.354390050711461",
                "uuid": "160cd7e0-bef9-4522-a58c-595de2065c0b",
                "resource_type": "node",
                "sliver_type": {
                    "name": "mobile_phone",
                    "urn": "urn:publicid:IDN+omf:testserver+slivertype+mobile_phone",
                    "uuid": "bf046805-e356-4849-8747-b8c436ca80ff",
                    "resource_type": "slivertype",
                    "disk_image_id": 34
                }
      },
            {
                "name": "1",
                "urn": "urn:publicid:IDN+omf:testserver+channel+1",
                "uuid": "3a72fb10-18b9-4541-9b18-c28d5860d441",
                "resource_type": "channel"
      },
            {
                "name": "2",
                "urn": "urn:publicid:IDN+omf:testserver+channel+2",
                "uuid": "7a15de1b-0db1-499d-9c61-6f68d5219059",
                "resource_type": "channel"
      },
            {
                "name": "i2cat",
                "urn": "urn:publicid:IDN+omf:testserver+account+i2cat",
                "uuid": "f66e088b-e914-4a19-835f-9ba81c2e6587",
                "resource_type": "account",
                "users": [
                    {
                        "name": "i2cat",
                        "urn": "urn:publicid:IDN+omf:testserver+user+i2cat",
                        "uuid": "fe8084b8-8455-4720-903d-ce434e782bd9",
                        "resource_type": "user"
          }
        ]
      },
            {
                "name": "ardadouk",
                "urn": "urn:publicid:IDN+omf.testserver+user+ardadouk",
                "uuid": "887196f3-0df3-4ab5-b202-a8084074eac4",
                "resource_type": "user",
                "accounts": [
                    {
                        "name": "ardadouk",
                        "urn": "urn:publicid:IDN+omf:testserver+account+ardadouk",
                        "uuid": "283b1ccc-c948-49a3-8534-69e10bbb846e",
                        "resource_type": "account",
                        "created_at": "2015-05-20T13:17:51Z",
                        "valid_until": "2018-07-12T10:13:26Z"
          },
                    {
                        "name": "testSlice",
                        "urn": "urn:publicid:IDN+omf:testserver+account+testSlice",
                        "uuid": "b97d332f-ab64-4f40-b9d8-be24968ea300",
                        "resource_type": "account",
                        "created_at": "2015-01-19T13:41:08Z",
                        "valid_until": "2015-04-29T13:41:08Z"
          },
                    {
                        "name": "sliceTest",
                        "urn": "urn:publicid:IDN+omf:testserver+account+sliceTest",
                        "uuid": "1a1b8c1f-e4ff-4131-8a7e-117465d11ca1",
                        "resource_type": "account",
                        "created_at": "2015-02-19T12:19:01Z",
                        "valid_until": "2020-05-30T12:19:01Z"
          }
        ]
      },
            {
                "name": "testSlice",
                "urn": "urn:publicid:IDN+omf:testserver+account+testSlice",
                "uuid": "b97d332f-ab64-4f40-b9d8-be24968ea300",
                "resource_type": "account",
                "users": [
                    {
                        "name": "ardadouk",
                        "urn": "urn:publicid:IDN+omf.testserver+user+ardadouk",
                        "uuid": "887196f3-0df3-4ab5-b202-a8084074eac4",
                        "resource_type": "user"
          }
        ]
      },
            {
                "name": "testuser1",
                "urn": "urn:publicid:IDN+omf:testserver+user+testuser1",
                "uuid": "f5a5f992-dbea-441e-b889-be97da40f806",
                "resource_type": "user",
                "accounts": [
                    {
                        "name": "sliceTest",
                        "urn": "urn:publicid:IDN+omf:testserver+account+sliceTest",
                        "uuid": "1a1b8c1f-e4ff-4131-8a7e-117465d11ca1",
                        "resource_type": "account",
                        "created_at": "2015-02-19T12:19:01Z",
                        "valid_until": "2020-05-30T12:19:01Z"
          },
                    {
                        "name": "sliceTest2",
                        "urn": "urn:publicid:IDN+omf:testserver+account+sliceTest2",
                        "uuid": "b84ad186-7445-4370-9184-e8b4273fba8b",
                        "resource_type": "account",
                        "created_at": "2015-02-19T14:02:19Z",
                        "valid_until": "2015-05-30T14:02:19Z"
          },
                    {
                        "name": "kokousias",
                        "urn": "urn:publicid:IDN+omf:testserver+account+kokousias",
                        "uuid": "366cbb50-de77-4932-b78b-cb1d4d4db12b",
                        "resource_type": "account",
                        "created_at": "2015-05-13T16:02:07Z",
                        "valid_until": "2015-08-21T16:02:07Z"
          }
        ]
      },
            {
                "name": "sliceTest",
                "urn": "urn:publicid:IDN+omf:testserver+account+sliceTest",
                "uuid": "1a1b8c1f-e4ff-4131-8a7e-117465d11ca1",
                "resource_type": "account",
                "users": [
                    {
                        "name": "ardadouk",
                        "urn": "urn:publicid:IDN+omf.testserver+user+ardadouk",
                        "uuid": "887196f3-0df3-4ab5-b202-a8084074eac4",
                        "resource_type": "user"
          },
                    {
                        "name": "testuser1",
                        "urn": "urn:publicid:IDN+omf:testserver+user+testuser1",
                        "uuid": "f5a5f992-dbea-441e-b889-be97da40f806",
                        "resource_type": "user"
          }
        ]
      },
            {
                "name": "sliceTest2",
                "urn": "urn:publicid:IDN+omf:testserver+account+sliceTest2",
                "uuid": "b84ad186-7445-4370-9184-e8b4273fba8b",
                "resource_type": "account",
                "users": [
                    {
                        "name": "testuser1",
                        "urn": "urn:publicid:IDN+omf:testserver+user+testuser1",
                        "uuid": "f5a5f992-dbea-441e-b889-be97da40f806",
                        "resource_type": "user"
          }
        ]
      },
            {
                "name": "wimax_base_station001",
                "urn": "urn:publicid:IDN+omf:testserver+wimaxbasestation+wimax_base_station001",
                "uuid": "eded801d-20a6-4eaa-840a-4955353db182",
                "resource_type": "wimaxbasestation"
      },
            {
                "name": "i2cat",
                "urn": "urn:publicid:IDN+omf:testserver+user+i2cat",
                "uuid": "fe8084b8-8455-4720-903d-ce434e782bd9",
                "resource_type": "user",
                "accounts": [
                    {
                        "name": "i2cat",
                        "urn": "urn:publicid:IDN+omf:testserver+account+i2cat",
                        "uuid": "f66e088b-e914-4a19-835f-9ba81c2e6587",
                        "resource_type": "account",
                        "created_at": "2015-01-14T14:35:04Z",
                        "valid_until": "2030-04-24T15:35:04Z"
          }
        ]
      },
            {
                "name": "kokousias",
                "urn": "urn:publicid:IDN+omf:testserver+account+kokousias",
                "uuid": "366cbb50-de77-4932-b78b-cb1d4d4db12b",
                "resource_type": "account",
                "users": [
                    {
                        "name": "testuser1",
                        "urn": "urn:publicid:IDN+omf:testserver+user+testuser1",
                        "uuid": "f5a5f992-dbea-441e-b889-be97da40f806",
                        "resource_type": "user"
          }
        ]
      },
            {
                "name": "dostavro",
                "urn": "urn:publicid:IDN+omf:testserver+user+dostavro",
                "uuid": "c71082d9-603a-463f-b481-72a64f5c5978",
                "resource_type": "user"
      },
            {
                "name": "dostavroTest",
                "urn": "urn:publicid:IDN+omf:testserver+account+dostavroTest",
                "uuid": "6c5e34a6-4198-4580-8c17-5cdeeb5c5f4f",
                "resource_type": "account"
      },
            {
                "name": "node086",
                "urn": "urn:publicid:IDN+omf:nitos.indoor+node+node086",
                "uuid": "e71857c1-7234-46cb-b369-921326a7faee",
                "resource_type": "node",
                "interfaces": [
                    {
                        "name": "node086:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node086:if0",
                        "uuid": "e109b72c-9bf7-4904-91df-fc97f2ff0717",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "mac": "00:03:1D:0D:BC:98",
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+fb0943f3-e9b6-4d8c-957b-df9dcf94eb26",
                                "uuid": "fb0943f3-e9b6-4d8c-957b-df9dcf94eb26",
                                "resource_type": "ip",
                                "address": "10.0.1.86",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ]
          },
                    {
                        "name": "node086:if1",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node086:if1",
                        "uuid": "117b6b9b-95ed-47ab-afcd-5c8eba51a66e",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "experimental",
                        "mac": "00:03:1D:0D:BC:99"
          }
        ],
                "cpus": [
                    {
                        "urn": "urn:publicid:IDN+omf:testserver+cpu+aa061267-0a92-4643-b426-83dfb7e79b3d",
                        "uuid": "aa061267-0a92-4643-b426-83dfb7e79b3d",
                        "resource_type": "cpu",
                        "exclusive": true,
                        "node_id": 433,
                        "cpu_type": "Intel(R) Core(TM) i7-3770 CPU @ 3.40GHz",
                        "cores": 4,
                        "threads": 8,
                        "cache_l1": "32 KB",
                        "cache_l2": "8 MB"
          }
        ],
                "cmc": {
                    "name": "node086:cm",
                    "urn": "urn:publicid:IDN+omf:testserver+cmc+node086:cm",
                    "uuid": "0ac1669b-3227-431a-a701-2a8d4ce97c9d",
                    "resource_type": "cmc",
                    "exclusive": true,
                    "mac": "09:A2:DA:0D:F0:86",
                    "ip": {
                        "urn": "urn:publicid:IDN+omf:testserver+ip+91b2db0b-243a-4ced-ac66-ff19b758ddf2",
                        "uuid": "91b2db0b-243a-4ced-ac66-ff19b758ddf2",
                        "resource_type": "ip",
                        "address": "10.1.0.86",
                        "netmask": "255.255.255.0",
                        "ip_type": "ipv4"
                    }
                }
      },
            {
                "name": "node087",
                "urn": "urn:publicid:IDN+omf:nitos.indoor+node+node087",
                "uuid": "190b95dd-e77f-49c8-be2c-c57e2b7f9854",
                "resource_type": "node",
                "interfaces": [
                    {
                        "name": "node087:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node087:if0",
                        "uuid": "f19e4283-fe1a-462a-94fb-220cee3f5109",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "mac": "00:03:1D:0D:BC:A6",
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+6e2ff86f-0fae-40cf-ade2-6eafa87516f9",
                                "uuid": "6e2ff86f-0fae-40cf-ade2-6eafa87516f9",
                                "resource_type": "ip",
                                "address": "10.0.1.87",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ]
          },
                    {
                        "name": "node087:if1",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node087:if1",
                        "uuid": "076066b3-701e-46c3-a4bf-8fdad5000cb3",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "experimental",
                        "mac": "00:03:1D:0D:BC:A7"
          }
        ],
                "cpus": [
                    {
                        "urn": "urn:publicid:IDN+omf:testserver+cpu+081ba8a4-d3a0-4a9e-82fd-36a4ea92b8e8",
                        "uuid": "081ba8a4-d3a0-4a9e-82fd-36a4ea92b8e8",
                        "resource_type": "cpu",
                        "exclusive": true,
                        "node_id": 440,
                        "cpu_type": "Intel(R) Core(TM) i7-3770 CPU @ 3.40GHz",
                        "cores": 4,
                        "threads": 8,
                        "cache_l1": "32 KB",
                        "cache_l2": "8 MB"
          }
        ],
                "cmc": {
                    "name": "node087:cm",
                    "urn": "urn:publicid:IDN+omf:testserver+cmc+node087:cm",
                    "uuid": "a0d86aca-54dd-46dc-9a1b-dffa88a262be",
                    "resource_type": "cmc",
                    "exclusive": true,
                    "mac": "09:A2:DA:0D:F0:87",
                    "ip": {
                        "urn": "urn:publicid:IDN+omf:testserver+ip+668ac89e-5bf7-48e2-9270-665e89c6ff9c",
                        "uuid": "668ac89e-5bf7-48e2-9270-665e89c6ff9c",
                        "resource_type": "ip",
                        "address": "10.1.0.87",
                        "netmask": "255.255.255.0",
                        "ip_type": "ipv4"
                    }
                }
      },
            {
                "name": "node088",
                "urn": "urn:publicid:IDN+omf:nitos.indoor+node+node088",
                "uuid": "67e31c12-93ea-4304-8062-c926aed7b6c5",
                "resource_type": "node",
                "interfaces": [
                    {
                        "name": "node088:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node088:if0",
                        "uuid": "e1d21e2e-0a71-490b-8f6f-e573d978005d",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "mac": "00:03:1D:0D:BC:C6",
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+6b257374-eb18-42d0-9182-b28cf48a454a",
                                "uuid": "6b257374-eb18-42d0-9182-b28cf48a454a",
                                "resource_type": "ip",
                                "address": "10.0.1.88",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ]
          },
                    {
                        "name": "node088:if1",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node088:if1",
                        "uuid": "d64c1632-ac75-4774-af52-b8ffad8254e4",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "experimental",
                        "mac": "00:03:1D:0D:BC:C7"
          }
        ],
                "cpus": [
                    {
                        "urn": "urn:publicid:IDN+omf:testserver+cpu+a9ada605-3381-4f60-b5f1-b3204178c4ce",
                        "uuid": "a9ada605-3381-4f60-b5f1-b3204178c4ce",
                        "resource_type": "cpu",
                        "exclusive": true,
                        "node_id": 447,
                        "cpu_type": "Intel(R) Core(TM) i7-3770 CPU @ 3.40GHz",
                        "cores": 4,
                        "threads": 8,
                        "cache_l1": "32 KB",
                        "cache_l2": "8 MB"
          }
        ],
                "cmc": {
                    "name": "node088:cm",
                    "urn": "urn:publicid:IDN+omf:testserver+cmc+node088:cm",
                    "uuid": "efaf1444-678e-4264-9222-ff93ada45253",
                    "resource_type": "cmc",
                    "exclusive": true,
                    "mac": "09:A2:DA:0D:F0:88",
                    "ip": {
                        "urn": "urn:publicid:IDN+omf:testserver+ip+2e1ae2c0-fa94-4676-8b13-b3da85808e16",
                        "uuid": "2e1ae2c0-fa94-4676-8b13-b3da85808e16",
                        "resource_type": "ip",
                        "address": "10.1.0.88",
                        "netmask": "255.255.255.0",
                        "ip_type": "ipv4"
                    }
                }
      },
            {
                "name": "node089",
                "urn": "urn:publicid:IDN+omf:nitos.indoor+node+node089",
                "uuid": "d4069246-4613-42c3-b957-c0399a692b83",
                "resource_type": "node",
                "interfaces": [
                    {
                        "name": "node087:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node087:if0",
                        "uuid": "8efa6966-59a5-4806-b947-2b31862cea0e",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "mac": "00:03:1D:0D:BC:AA",
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+9e621060-ccb9-4496-b7b2-f5c0f312e87b",
                                "uuid": "9e621060-ccb9-4496-b7b2-f5c0f312e87b",
                                "resource_type": "ip",
                                "address": "10.0.1.89",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ]
          },
                    {
                        "name": "node087:if1",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node087:if1",
                        "uuid": "c46cf011-5adf-4752-80f3-d3234d609add",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "experimental",
                        "mac": "00:03:1D:0D:BC:AB"
          }
        ],
                "cpus": [
                    {
                        "urn": "urn:publicid:IDN+omf:testserver+cpu+c89090c3-2136-454b-9c31-b329ef5fd2c0",
                        "uuid": "c89090c3-2136-454b-9c31-b329ef5fd2c0",
                        "resource_type": "cpu",
                        "exclusive": true,
                        "node_id": 454,
                        "cpu_type": "Intel(R) Core(TM) i7-3770 CPU @ 3.40GHz",
                        "cores": 4,
                        "threads": 8,
                        "cache_l1": "32 KB",
                        "cache_l2": "8 MB"
          }
        ],
                "cmc": {
                    "name": "node089:cm",
                    "urn": "urn:publicid:IDN+omf:testserver+cmc+node089:cm",
                    "uuid": "0cae9b07-201f-4212-9453-a2cb660f9f25",
                    "resource_type": "cmc",
                    "exclusive": true,
                    "mac": "09:A2:DA:0D:F0:89",
                    "ip": {
                        "urn": "urn:publicid:IDN+omf:testserver+ip+7e5f92d4-5a3f-4261-ac09-54954edb4993",
                        "uuid": "7e5f92d4-5a3f-4261-ac09-54954edb4993",
                        "resource_type": "ip",
                        "address": "10.1.0.89",
                        "netmask": "255.255.255.0",
                        "ip_type": "ipv4"
                    }
                }
      },
            {
                "name": "bb046f48-35ca-4ecd-9974-748b946885b1/8116126",
                "urn": "urn:publicid:IDN+omf:testserver+lease+bb046f48-35ca-4ecd-9974-748b946885b1/8116126",
                "uuid": "03da0a62-62f9-4ac6-bd34-a293c4734622",
                "resource_type": "lease",
                "components": [

        ],
                "account": {
                    "name": "__default__",
                    "urn": "urn:publicid:IDN+omf:testserver+account+__default__",
                    "uuid": "bb046f48-35ca-4ecd-9974-748b946885b1",
                    "resource_type": "account",
                    "created_at": "2015-01-14T14:33:50Z",
                    "valid_until": "2331-12-05T08:20:30Z"
                }
      },
            {
                "name": "node099",
                "urn": "urn:publicid:IDN+omf:nitos.indoor+node+node099",
                "uuid": "ba090f3a-434a-49bc-b49a-e2a8403eda1b",
                "resource_type": "node",
                "interfaces": [
                    {
                        "name": "node059:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node059:if0",
                        "uuid": "fa8b871b-0f28-49d8-abb5-ed2caec6cc10",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "mac": "00:03:1D:0D:4B:C8",
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+572e7e51-5838-4434-9a78-a3d1d7f60b3f",
                                "uuid": "572e7e51-5838-4434-9a78-a3d1d7f60b3f",
                                "resource_type": "ip",
                                "address": "10.0.1.59",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ]
          },
                    {
                        "name": "node059:if1",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node059:if1",
                        "uuid": "82f62e93-8ba2-4300-9fa3-84e4b46d3937",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "experimental",
                        "mac": "00:03:1D:0D:4B:C9"
          }
        ],
                "cpus": [
                    {
                        "urn": "urn:publicid:IDN+omf:testserver+cpu+1ceec1d7-8554-453d-a984-978ac3bbb729",
                        "uuid": "1ceec1d7-8554-453d-a984-978ac3bbb729",
                        "resource_type": "cpu",
                        "exclusive": true,
                        "node_id": 515,
                        "cpu_type": "Intel(R) Core(TM) i7-3770 CPU @ 3.40GHz",
                        "cores": 4,
                        "threads": 8,
                        "cache_l1": "32 KB",
                        "cache_l2": "8 MB"
          }
        ],
                "cmc": {
                    "name": "node059:cm",
                    "urn": "urn:publicid:IDN+omf:testserver+cmc+node059:cm",
                    "uuid": "8efad8d1-d8ed-4fc6-8c4c-7eb858f888e4",
                    "resource_type": "cmc",
                    "exclusive": true,
                    "mac": "09:A2:DA:0D:F0:59",
                    "ip": {
                        "urn": "urn:publicid:IDN+omf:testserver+ip+55e93852-f21a-4b36-b955-618e45701c17",
                        "uuid": "55e93852-f21a-4b36-b955-618e45701c17",
                        "resource_type": "ip",
                        "address": "10.1.0.59",
                        "netmask": "255.255.255.0",
                        "ip_type": "ipv4"
                    }
                }
      },
            {
                "name": "node061",
                "urn": "urn:publicid:IDN+omf:nitos.indoor+node+node061",
                "uuid": "9a7ac3ed-7308-4dfd-b533-306361b58952",
                "resource_type": "node",
                "interfaces": [
                    {
                        "name": "node061:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node061:if0",
                        "uuid": "52001475-b9a5-4351-aebf-48ee3ad2ae06",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "mac": "00:03:1D:0D:BC:70",
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+9ebe95d3-ee7f-4655-a77a-edd7fa5789a5",
                                "uuid": "9ebe95d3-ee7f-4655-a77a-edd7fa5789a5",
                                "resource_type": "ip",
                                "address": "10.0.1.61",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ]
          },
                    {
                        "name": "node061:if1",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node061:if1",
                        "uuid": "6cac9eae-bc35-4148-a51a-a8574d56815c",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "experimental",
                        "mac": "00:03:1D:0D:BC:71"
          }
        ],
                "cpus": [
                    {
                        "urn": "urn:publicid:IDN+omf:testserver+cpu+f9eb2964-be29-4b24-bee3-5d48903f4f91",
                        "uuid": "f9eb2964-be29-4b24-bee3-5d48903f4f91",
                        "resource_type": "cpu",
                        "exclusive": true,
                        "node_id": 522,
                        "cpu_type": "Intel(R) Core(TM) i7-3770 CPU @ 3.40GHz",
                        "cores": 4,
                        "threads": 8,
                        "cache_l1": "32 KB",
                        "cache_l2": "8 MB"
          }
        ],
                "cmc": {
                    "name": "node061:cm",
                    "urn": "urn:publicid:IDN+omf:testserver+cmc+node061:cm",
                    "uuid": "1b64a94b-370f-4baa-82d7-ab80db8414c4",
                    "resource_type": "cmc",
                    "exclusive": true,
                    "mac": "09:A2:DA:0D:F0:61",
                    "ip": {
                        "urn": "urn:publicid:IDN+omf:testserver+ip+2924bebe-0da0-4d90-9efc-b94d9adb8fd9",
                        "uuid": "2924bebe-0da0-4d90-9efc-b94d9adb8fd9",
                        "resource_type": "ip",
                        "address": "10.1.0.61",
                        "netmask": "255.255.255.0",
                        "ip_type": "ipv4"
                    }
                }
      },
            {
                "name": "node065",
                "urn": "urn:publicid:IDN+omf:nitos.indoor+node+node065",
                "uuid": "7bf963f6-41a9-4994-a699-dab30dffdd69",
                "resource_type": "node",
                "interfaces": [
                    {
                        "name": "node065:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node065:if0",
                        "uuid": "e0c84b38-5791-4325-8df4-1a8671678361",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "mac": "00:03:1D:0D:BC:7E",
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+5c4c56ea-d38f-45af-87fe-e66f502206a3",
                                "uuid": "5c4c56ea-d38f-45af-87fe-e66f502206a3",
                                "resource_type": "ip",
                                "address": "10.0.1.65",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ]
          },
                    {
                        "name": "node065:if1",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node065:if1",
                        "uuid": "c2d79807-c062-4d3f-9a0f-4bd2edd402c2",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "experimental",
                        "mac": "00:03:1D:0D:BC:7F"
          }
        ],
                "cpus": [
                    {
                        "urn": "urn:publicid:IDN+omf:testserver+cpu+7b2a175c-5564-404e-af93-00434b45a0a0",
                        "uuid": "7b2a175c-5564-404e-af93-00434b45a0a0",
                        "resource_type": "cpu",
                        "exclusive": true,
                        "node_id": 529,
                        "cpu_type": "Intel(R) Core(TM) i7-3770 CPU @ 3.40GHz",
                        "cores": 4,
                        "threads": 8,
                        "cache_l1": "32 KB",
                        "cache_l2": "8 MB"
          }
        ],
                "cmc": {
                    "name": "node065:cm",
                    "urn": "urn:publicid:IDN+omf:testserver+cmc+node065:cm",
                    "uuid": "a824a690-e4be-4c7c-a694-5cfe6bba68be",
                    "resource_type": "cmc",
                    "exclusive": true,
                    "mac": "09:A2:DA:0D:F0:65",
                    "ip": {
                        "urn": "urn:publicid:IDN+omf:testserver+ip+cb804398-9640-4322-b2e8-c95e490fb0ad",
                        "uuid": "cb804398-9640-4322-b2e8-c95e490fb0ad",
                        "resource_type": "ip",
                        "address": "10.1.0.65",
                        "netmask": "255.255.255.0",
                        "ip_type": "ipv4"
                    }
                }
      },
            {
                "name": "node069",
                "urn": "urn:publicid:IDN+omf:nitos.indoor+node+node069",
                "uuid": "14747c3c-3f92-4dff-892d-84faa6d464ab",
                "resource_type": "node",
                "interfaces": [
                    {
                        "name": "node069:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node069:if0",
                        "uuid": "bc273664-c546-44d1-8f0b-a9781bcbeadc",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "mac": "00:03:1D:0D:BC:6C",
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+c3c7c4f5-a97b-479c-a239-c32d1010283b",
                                "uuid": "c3c7c4f5-a97b-479c-a239-c32d1010283b",
                                "resource_type": "ip",
                                "address": "10.0.1.69",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ]
          },
                    {
                        "name": "node069:if1",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node069:if1",
                        "uuid": "e0a1585b-a75e-42c3-b258-91105559e6b3",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "experimental",
                        "mac": "00:03:1D:0D:BC:6D"
          }
        ],
                "cpus": [
                    {
                        "urn": "urn:publicid:IDN+omf:testserver+cpu+d351109b-2e94-403f-8e8a-e537a5f13b23",
                        "uuid": "d351109b-2e94-403f-8e8a-e537a5f13b23",
                        "resource_type": "cpu",
                        "exclusive": true,
                        "node_id": 536,
                        "cpu_type": "Intel(R) Core(TM) i7-3770 CPU @ 3.40GHz",
                        "cores": 4,
                        "threads": 8,
                        "cache_l1": "32 KB",
                        "cache_l2": "8 MB"
          }
        ],
                "cmc": {
                    "name": "node069:cm",
                    "urn": "urn:publicid:IDN+omf:testserver+cmc+node069:cm",
                    "uuid": "5e4d45f0-ace4-42d2-8914-a1abc173e5b0",
                    "resource_type": "cmc",
                    "exclusive": true,
                    "mac": "09:A2:DA:0D:F0:69",
                    "ip": {
                        "urn": "urn:publicid:IDN+omf:testserver+ip+7c9cb466-6f21-41db-9237-f673d26ee301",
                        "uuid": "7c9cb466-6f21-41db-9237-f673d26ee301",
                        "resource_type": "ip",
                        "address": "10.1.0.69",
                        "netmask": "255.255.255.0",
                        "ip_type": "ipv4"
                    }
                }
      },
            {
                "name": "node076",
                "urn": "urn:publicid:IDN+omf:nitos.indoor+node+node076",
                "uuid": "f537f2bd-c8ce-47b2-bec7-c85b982e761c",
                "resource_type": "node",
                "interfaces": [
                    {
                        "name": "node076:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node076:if0",
                        "uuid": "f06672fc-2b1a-4f76-9b0f-234e4f92c453",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "mac": "00:03:1D:0D:BC:9E",
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+61673a2e-857a-432a-82fb-20da54226682",
                                "uuid": "61673a2e-857a-432a-82fb-20da54226682",
                                "resource_type": "ip",
                                "address": "10.0.1.76",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ]
          },
                    {
                        "name": "node076:if1",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node076:if1",
                        "uuid": "e5bffc4b-0882-48ce-badd-2d9439805126",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "experimental",
                        "mac": "00:03:1D:0D:BC:9F"
          }
        ],
                "cpus": [
                    {
                        "urn": "urn:publicid:IDN+omf:testserver+cpu+828239a5-4b2c-4271-a229-010edc81b8b3",
                        "uuid": "828239a5-4b2c-4271-a229-010edc81b8b3",
                        "resource_type": "cpu",
                        "exclusive": true,
                        "node_id": 543,
                        "cpu_type": "Intel(R) Core(TM) i7-3770 CPU @ 3.40GHz",
                        "cores": 4,
                        "threads": 8,
                        "cache_l1": "32 KB",
                        "cache_l2": "8 MB"
          }
        ],
                "cmc": {
                    "name": "node076:cm",
                    "urn": "urn:publicid:IDN+omf:testserver+cmc+node076:cm",
                    "uuid": "297848f2-caaf-4095-8b3f-a6868315ab89",
                    "resource_type": "cmc",
                    "exclusive": true,
                    "mac": "09:A2:DA:0D:F0:76",
                    "ip": {
                        "urn": "urn:publicid:IDN+omf:testserver+ip+7911321d-475e-4101-b5c8-ec3dfec72d51",
                        "uuid": "7911321d-475e-4101-b5c8-ec3dfec72d51",
                        "resource_type": "ip",
                        "address": "10.1.0.76",
                        "netmask": "255.255.255.0",
                        "ip_type": "ipv4"
                    }
                }
      },
            {
                "name": "node077",
                "urn": "urn:publicid:IDN+omf:nitos.indoor+node+node077",
                "uuid": "204d16fc-a6df-40ca-857e-61e09533e80b",
                "resource_type": "node",
                "interfaces": [
                    {
                        "name": "node077:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node077:if0",
                        "uuid": "89f588c7-364b-49da-b6a1-abd18e57c0d8",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "mac": "00:03:1D:0D:BC:A4",
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+18922322-8558-4c21-ab6a-8e0eea179f54",
                                "uuid": "18922322-8558-4c21-ab6a-8e0eea179f54",
                                "resource_type": "ip",
                                "address": "10.0.1.77",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ]
          },
                    {
                        "name": "node077:if1",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node077:if1",
                        "uuid": "47b25778-cec3-4da8-9b96-8999c3bdad46",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "experimental",
                        "mac": "00:03:1D:0D:BC:A5"
          }
        ],
                "cpus": [
                    {
                        "urn": "urn:publicid:IDN+omf:testserver+cpu+95edfe15-44c7-41ca-b075-2b96c0ac9077",
                        "uuid": "95edfe15-44c7-41ca-b075-2b96c0ac9077",
                        "resource_type": "cpu",
                        "exclusive": true,
                        "node_id": 550,
                        "cpu_type": "Intel(R) Core(TM) i7-3770 CPU @ 3.40GHz",
                        "cores": 4,
                        "threads": 8,
                        "cache_l1": "32 KB",
                        "cache_l2": "8 MB"
          }
        ],
                "cmc": {
                    "name": "node077:cm",
                    "urn": "urn:publicid:IDN+omf:testserver+cmc+node077:cm",
                    "uuid": "3f9cb771-6931-4c42-a259-b9e9db2afb75",
                    "resource_type": "cmc",
                    "exclusive": true,
                    "mac": "09:A2:DA:0D:F0:77",
                    "ip": {
                        "urn": "urn:publicid:IDN+omf:testserver+ip+c6b0d93c-08c7-4832-88b7-3089ec27e8e7",
                        "uuid": "c6b0d93c-08c7-4832-88b7-3089ec27e8e7",
                        "resource_type": "ip",
                        "address": "10.1.0.77",
                        "netmask": "255.255.255.0",
                        "ip_type": "ipv4"
                    }
                }
      },
            {
                "name": "3",
                "urn": "urn:publicid:IDN+omf:testserver+channel+3",
                "uuid": "e147d23f-c5be-4429-9d35-f6012c66082f",
                "resource_type": "channel"
      },
            {
                "name": "4",
                "urn": "urn:publicid:IDN+omf:testserver+channel+4",
                "uuid": "00f291c5-dc74-41f0-96bf-9dfc0c28e559",
                "resource_type": "channel"
      },
            {
                "name": "epc001",
                "urn": "urn:publicid:IDN+omf:testserver+epc+epc001",
                "uuid": "6b94586a-c914-4af1-81cb-a55fc025791e",
                "resource_type": "epc",
                "control_ip": {
                    "urn": "urn:publicid:IDN+omf:testserver+ip+37fd6e8e-5ee4-4a9e-8a96-c108690df6d7",
                    "uuid": "37fd6e8e-5ee4-4a9e-8a96-c108690df6d7",
                    "resource_type": "ip",
                    "address": "194.177.207.3",
                    "netmask": "255.255.255.240",
                    "ip_type": "ipv4"
                },
                "e_node_bs": [
                    {
                        "name": "e_node_b_001",
                        "urn": "urn:publicid:IDN+omf:testserver+enodeb+e_node_b_001",
                        "uuid": "c4c2a6d9-47fa-4dea-8255-822b1c0f746b",
                        "resource_type": "enodeb",
                        "domain": "omf:nitos.indoor",
                        "exclusive": true,
                        "base_model": "245F",
                        "vendor": "ip.access",
                        "mode": "fdd",
                        "center_ul_frequency": "2535 MHz",
                        "center_dl_frequency": "2655 MHz",
                        "channel_bandwidth": "10 MHz",
                        "number_of_antennas": 2,
                        "tx_power": "15 dbi",
                        "mme_sctp_port": 36412
          },
                    {
                        "name": "e_node_b_002",
                        "urn": "urn:publicid:IDN+omf:testserver+enodeb+e_node_b_002",
                        "uuid": "b32157e2-cfa5-46f3-bb38-0c0264b48509",
                        "resource_type": "enodeb",
                        "domain": "omf:nitos.indoor",
                        "exclusive": true,
                        "base_model": "245F",
                        "vendor": "ip.access",
                        "mode": "fdd",
                        "center_ul_frequency": "2535 MHz",
                        "center_dl_frequency": "2655 MHz",
                        "channel_bandwidth": "10 MHz",
                        "number_of_antennas": 2,
                        "tx_power": "15 dbi",
                        "mme_sctp_port": 36412
          }
        ]
      },
            {
                "name": "e_node_b_001",
                "urn": "urn:publicid:IDN+omf:testserver+enodeb+e_node_b_001",
                "uuid": "c4c2a6d9-47fa-4dea-8255-822b1c0f746b",
                "resource_type": "enodeb",
                "control_ip": {
                    "urn": "urn:publicid:IDN+omf:testserver+ip+f01856da-21f1-4f8b-beb6-4f52f4a19d2f",
                    "uuid": "f01856da-21f1-4f8b-beb6-4f52f4a19d2f",
                    "resource_type": "ip",
                    "address": "192.168.200.1",
                    "netmask": "255.255.255.0",
                    "ip_type": "ipv4"
                },
                "pgw_ip": {
                    "urn": "urn:publicid:IDN+omf:testserver+ip+d35c987b-9c89-4629-a4e1-3281e8b602ba",
                    "uuid": "d35c987b-9c89-4629-a4e1-3281e8b602ba",
                    "resource_type": "ip",
                    "address": "192.168.200.200",
                    "netmask": "255.255.255.0",
                    "ip_type": "ipv4"
                },
                "mme_ip": {
                    "urn": "urn:publicid:IDN+omf:testserver+ip+3e1cc258-f670-4639-9e65-7e2363aeca76",
                    "uuid": "3e1cc258-f670-4639-9e65-7e2363aeca76",
                    "resource_type": "ip",
                    "address": "192.168.200.200",
                    "netmask": "255.255.255.0",
                    "ip_type": "ipv4"
                },
                "epc": {
                    "name": "epc001",
                    "urn": "urn:publicid:IDN+omf:testserver+epc+epc001",
                    "uuid": "6b94586a-c914-4af1-81cb-a55fc025791e",
                    "resource_type": "epc",
                    "domain": "omf:nitos.indoor",
                    "available": true,
                    "exclusive": true,
                    "base_model": "LTEnet",
                    "vendor": "SIRRAN",
                    "plmnid": 46099
                },
                "cmc": {
                    "name": "e_node_b_001:cm",
                    "urn": "urn:publicid:IDN+omf:testserver+cmc+e_node_b_001:cm",
                    "uuid": "8f1e9b23-0e90-45e2-b1dd-26231042abc9",
                    "resource_type": "cmc",
                    "exclusive": true,
                    "mac": "09:A2:DA:0D:F2:01",
                    "ip": {
                        "urn": "urn:publicid:IDN+omf:testserver+ip+1e9f36d5-f6a2-4523-a464-c1fc6b7ed473",
                        "uuid": "1e9f36d5-f6a2-4523-a464-c1fc6b7ed473",
                        "resource_type": "ip",
                        "address": "10.1.0.201",
                        "netmask": "255.255.255.0",
                        "ip_type": "ipv4"
                    }
                }
      },
            {
                "name": "e_node_b_002",
                "urn": "urn:publicid:IDN+omf:testserver+enodeb+e_node_b_002",
                "uuid": "b32157e2-cfa5-46f3-bb38-0c0264b48509",
                "resource_type": "enodeb",
                "control_ip": {
                    "urn": "urn:publicid:IDN+omf:testserver+ip+d46c4e06-c03b-40fd-a515-e8646e3376e2",
                    "uuid": "d46c4e06-c03b-40fd-a515-e8646e3376e2",
                    "resource_type": "ip",
                    "address": "192.168.200.2",
                    "netmask": "255.255.255.0",
                    "ip_type": "ipv4"
                },
                "pgw_ip": {
                    "urn": "urn:publicid:IDN+omf:testserver+ip+ea11fef7-9037-49ad-8490-a37df56bff39",
                    "uuid": "ea11fef7-9037-49ad-8490-a37df56bff39",
                    "resource_type": "ip",
                    "address": "192.168.200.200",
                    "netmask": "255.255.255.0",
                    "ip_type": "ipv4"
                },
                "mme_ip": {
                    "urn": "urn:publicid:IDN+omf:testserver+ip+3bf40199-6589-4f77-8259-a440cc8de584",
                    "uuid": "3bf40199-6589-4f77-8259-a440cc8de584",
                    "resource_type": "ip",
                    "address": "192.168.200.200",
                    "netmask": "255.255.255.0",
                    "ip_type": "ipv4"
                },
                "epc": {
                    "name": "epc001",
                    "urn": "urn:publicid:IDN+omf:testserver+epc+epc001",
                    "uuid": "6b94586a-c914-4af1-81cb-a55fc025791e",
                    "resource_type": "epc",
                    "domain": "omf:nitos.indoor",
                    "available": true,
                    "exclusive": true,
                    "base_model": "LTEnet",
                    "vendor": "SIRRAN",
                    "plmnid": 46099
                }
      },
            {
                "name": "of_switch001",
                "urn": "urn:publicid:IDN+omf:testserver+openflowswitch+of_switch001",
                "uuid": "1b45383e-0d85-4b65-9f3a-d33ea397cbf3",
                "resource_type": "openflowswitch",
                "of_controller_ip": {
                    "urn": "urn:publicid:IDN+omf:testserver+ip+fce240fc-1d4e-46f7-b31e-e88f5b9561bd",
                    "uuid": "fce240fc-1d4e-46f7-b31e-e88f5b9561bd",
                    "resource_type": "ip",
                    "address": "83.212.32.137",
                    "netmask": "255.255.255.240",
                    "ip_type": "ipv4"
                },
                "interfaces": [
                    {
                        "name": "of_switch001:port001",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+of_switch001:port001",
                        "uuid": "d862d367-fa2c-467a-a03d-5b5a9ce6841c",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "of_switch_port",
                        "mac": "00:03:1D:0D:90:01",
                        "openflow_switch_id": 600
          },
                    {
                        "name": "of_switch001:port002",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+of_switch001:port002",
                        "uuid": "9ef1d9a5-ae83-4c4f-ad00-d8bb2a66bdee",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "of_switch_port",
                        "mac": "00:03:1D:0D:90:02",
                        "openflow_switch_id": 600
          },
                    {
                        "name": "of_switch001:port003",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+of_switch001:port003",
                        "uuid": "bc7d129c-d306-469c-93b3-1c529e78839d",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "of_switch_port",
                        "mac": "00:03:1D:0D:90:03",
                        "openflow_switch_id": 600
          },
                    {
                        "name": "of_switch001:port004",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+of_switch001:port004",
                        "uuid": "33e3a96e-8f5c-43dc-8d78-6cec24128029",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "of_switch_port",
                        "mac": "00:03:1D:0D:90:04",
                        "openflow_switch_id": 600
          }
        ]
      },
            {
                "name": "usrp_ethernet_device001",
                "urn": "urn:publicid:IDN+omf:nitlab.indoor+lte_dongle+usrp_ethernet_device001",
                "uuid": "9ac90c6c-4d83-4252-b2b3-8910095394c4",
                "resource_type": "usrpethernetdevice",
                "interfaces": [
                    {
                        "name": "usrp_ethernet_device001:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+usrp_ethernet_device001:if0",
                        "uuid": "762cdbd8-6b85-421b-9044-25f3cde606b3",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "usrp_ethernet_device_id": 1785,
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+63a9257a-f2cd-42c8-a687-ad4577e009b0",
                                "uuid": "63a9257a-f2cd-42c8-a687-ad4577e009b0",
                                "resource_type": "ip",
                                "address": "192.168.10.2",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ],
                        "link": {
                            "name": "link001",
                            "uuid": "fdf7e3d1-e8e0-4d58-8e40-a618c27bae0f",
                            "urn": "urn:publicid:IDN+omf:testserver+link+link001",
                            "resource_type": "link",
                            "exclusive": true,
                            "connects": [
                                {
                                    "name": "node016",
                                    "urn": "urn:publicid:IDN+omf:testserver+node+node016",
                                    "uuid": "c5e5c8e3-3bb5-4312-bece-876538cbce58",
                                    "resource_type": "node",
                                    "domain": "omf:nitos.indoor",
                                    "available": true,
                                    "exclusive": true,
                                    "hardware_type": "PC-Grid",
                                    "hostname": "node016",
                                    "ram": "1.8905 GB",
                                    "ram_type": "DIMM Synchronous",
                                    "hd_capacity": "59.6263 GB",
                                    "monitored": true,
                                    "gateway": "10.64.44.30"
                },
                                {
                                    "name": "usrp_ethernet_device001",
                                    "urn": "urn:publicid:IDN+omf:nitlab.indoor+lte_dongle+usrp_ethernet_device001",
                                    "uuid": "9ac90c6c-4d83-4252-b2b3-8910095394c4",
                                    "resource_type": "usrpethernetdevice",
                                    "domain": "omf:nitlab.indoor",
                                    "exclusive": true,
                                    "operating_frequency": "70 MHz - 6 GHz",
                                    "cpu_model": "Xilinx Spartan 6 XC6SLX150",
                                    "antennas": "tx0: 2.4-5 GHz, rx0: 2.4-5 GHz",
                                    "base_model": "B210",
                                    "vendor": "Ettus Research",
                                    "number_of_antennas": "SISO 1x1"
                }
              ]
                        }
          }
        ]
      },
            {
                "name": "usrp_ethernet_device002",
                "urn": "urn:publicid:IDN+omf:nitlab.indoor+lte_dongle+usrp_ethernet_device002",
                "uuid": "0c94b3fd-e94f-4d1f-a4f4-f09168ea6208",
                "resource_type": "usrpethernetdevice",
                "interfaces": [
                    {
                        "name": "usrp_ethernet_device002:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+usrp_ethernet_device002:if0",
                        "uuid": "a998d9fc-48c5-46d3-8ba9-9b8ef847c6e2",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "usrp_ethernet_device_id": 1788,
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+29866516-368f-4c78-a78b-be219fa1c7e7",
                                "uuid": "29866516-368f-4c78-a78b-be219fa1c7e7",
                                "resource_type": "ip",
                                "address": "192.168.10.2",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ]
          }
        ]
      },
            {
                "name": "e_node_b_001:cm",
                "urn": "urn:publicid:IDN+omf:testserver+cmc+e_node_b_001:cm",
                "uuid": "8f1e9b23-0e90-45e2-b1dd-26231042abc9",
                "resource_type": "cmc",
                "ip": {
                    "urn": "urn:publicid:IDN+omf:testserver+ip+1e9f36d5-f6a2-4523-a464-c1fc6b7ed473",
                    "uuid": "1e9f36d5-f6a2-4523-a464-c1fc6b7ed473",
                    "resource_type": "ip",
                    "address": "10.1.0.201",
                    "netmask": "255.255.255.0",
                    "ip_type": "ipv4"
                }
      },
            {
                "name": "lte_dongle001",
                "urn": "urn:publicid:IDN+omf:nitlab.indoor+lte_dongle+lte_dongle001",
                "uuid": "26d7d298-535e-422e-8366-5a9fb30c46c8",
                "resource_type": "ltedongle"
      },
            {
                "name": "lte_dongle002",
                "urn": "urn:publicid:IDN+omf:nitlab.indoor+lte_dongle+lte_dongle002",
                "uuid": "9ba67f75-061c-4f49-ad0a-754259048e24",
                "resource_type": "ltedongle"
      },
            {
                "name": "lte_dongle003",
                "urn": "urn:publicid:IDN+omf:nitlab.indoor+lte_dongle+lte_dongle003",
                "uuid": "fb698419-545e-48de-bb3a-882bb6c39ce2",
                "resource_type": "ltedongle"
      },
            {
                "name": "lte_dongle004",
                "urn": "urn:publicid:IDN+omf:nitlab.indoor+lte_dongle+lte_dongle004",
                "uuid": "29fa1620-9278-4d47-96bd-a2cdf75c8d52",
                "resource_type": "ltedongle"
      },
            {
                "name": "lte_dongle005",
                "urn": "urn:publicid:IDN+omf:nitlab.indoor+lte_dongle+lte_dongle005",
                "uuid": "68578865-1c92-439f-acdd-d165c9365433",
                "resource_type": "ltedongle"
      },
            {
                "name": "lte_dongle006",
                "urn": "urn:publicid:IDN+omf:nitlab.indoor+lte_dongle+lte_dongle006",
                "uuid": "570a6221-8525-4598-95fa-1dc3a54bcb98",
                "resource_type": "ltedongle"
      },
            {
                "name": "lte_dongle007",
                "urn": "urn:publicid:IDN+omf:nitlab.indoor+lte_dongle+lte_dongle007",
                "uuid": "16bc3fc4-2931-4e3f-80fd-ccfd2d4bd91e",
                "resource_type": "ltedongle"
      },
            {
                "name": "wimax_dongle001",
                "urn": "urn:publicid:IDN+omf:nitlab.office+lte_dongle+wimax_dongle001",
                "uuid": "e3f338fd-6a4a-4540-9299-b52a274a48f7",
                "resource_type": "wimaxdongle"
      },
            {
                "name": "wimax_dongle002",
                "urn": "urn:publicid:IDN+omf:nitlab.office+lte_dongle+wimax_dongle002",
                "uuid": "c16f6310-0dac-40a2-afc4-cb359c9d8173",
                "resource_type": "wimaxdongle"
      },
            {
                "name": "wimax_dongle003",
                "urn": "urn:publicid:IDN+omf:nitlab.office+lte_dongle+wimax_dongle003",
                "uuid": "b2928708-20db-415f-b2b4-7d27b46bb523",
                "resource_type": "wimaxdongle"
      },
            {
                "name": "wimax_dongle004",
                "urn": "urn:publicid:IDN+omf:nitlab.office+lte_dongle+wimax_dongle004",
                "uuid": "bb050692-8632-4d4e-9542-4779d9329990",
                "resource_type": "wimaxdongle"
      },
            {
                "name": "wimax_dongle005",
                "urn": "urn:publicid:IDN+omf:nitlab.office+lte_dongle+wimax_dongle005",
                "uuid": "d068ce32-4119-46ed-aa19-a747dcde0c02",
                "resource_type": "wimaxdongle"
      },
            {
                "name": "wimax_dongle006",
                "urn": "urn:publicid:IDN+omf:nitlab.office+lte_dongle+wimax_dongle006",
                "uuid": "fd84e446-4b15-4d06-a753-943ffcd6b0ea",
                "resource_type": "wimaxdongle"
      },
            {
                "name": "usrp_usb_device001",
                "urn": "urn:publicid:IDN+omf:nitlab.indoor+lte_dongle+usrp_usb_device001",
                "uuid": "3182ad66-9135-44fe-aae5-41915e7a5986",
                "resource_type": "usrpusbdevice"
      },
            {
                "name": "usrp_usb_device002",
                "urn": "urn:publicid:IDN+omf:nitlab.indoor+lte_dongle+usrp_usb_device002",
                "uuid": "6f9847f4-8cb9-41f7-b269-a4d878ad2fd6",
                "resource_type": "usrpusbdevice"
      },
            {
                "name": "usrp_usb_device003",
                "urn": "urn:publicid:IDN+omf:nitlab.indoor+lte_dongle+usrp_usb_device003",
                "uuid": "957c7782-2207-4e7b-a82c-cde27fae1629",
                "resource_type": "usrpusbdevice"
      },
            {
                "name": "usrp_usb_device004",
                "urn": "urn:publicid:IDN+omf:nitlab.indoor+lte_dongle+usrp_usb_device004",
                "uuid": "c0a76724-d6ca-42a9-851a-e5e0cbb8491b",
                "resource_type": "usrpusbdevice"
      },
            {
                "name": "link001",
                "urn": "urn:publicid:IDN+omf:testserver+link+link001",
                "uuid": "fdf7e3d1-e8e0-4d58-8e40-a618c27bae0f",
                "resource_type": "link",
                "interfaces": [
                    {
                        "name": "node016:if1",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node016:if1",
                        "uuid": "425203f9-27b6-4c3b-8a6a-1df8b5feaf5f",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "experimental",
                        "mac": "00:03:1D:07:98:19",
                        "description": "1 Gbps ethernet",
                        "link": {
                            "name": "link001",
                            "uuid": "fdf7e3d1-e8e0-4d58-8e40-a618c27bae0f",
                            "urn": "urn:publicid:IDN+omf:testserver+link+link001",
                            "resource_type": "link",
                            "exclusive": true,
                            "connects": [
                                {
                                    "name": "node016",
                                    "urn": "urn:publicid:IDN+omf:testserver+node+node016",
                                    "uuid": "c5e5c8e3-3bb5-4312-bece-876538cbce58",
                                    "resource_type": "node",
                                    "domain": "omf:nitos.indoor",
                                    "available": true,
                                    "exclusive": true,
                                    "hardware_type": "PC-Grid",
                                    "hostname": "node016",
                                    "ram": "1.8905 GB",
                                    "ram_type": "DIMM Synchronous",
                                    "hd_capacity": "59.6263 GB",
                                    "monitored": true,
                                    "gateway": "10.64.44.30"
                },
                                {
                                    "name": "usrp_ethernet_device001",
                                    "urn": "urn:publicid:IDN+omf:nitlab.indoor+lte_dongle+usrp_ethernet_device001",
                                    "uuid": "9ac90c6c-4d83-4252-b2b3-8910095394c4",
                                    "resource_type": "usrpethernetdevice",
                                    "domain": "omf:nitlab.indoor",
                                    "exclusive": true,
                                    "operating_frequency": "70 MHz - 6 GHz",
                                    "cpu_model": "Xilinx Spartan 6 XC6SLX150",
                                    "antennas": "tx0: 2.4-5 GHz, rx0: 2.4-5 GHz",
                                    "base_model": "B210",
                                    "vendor": "Ettus Research",
                                    "number_of_antennas": "SISO 1x1"
                }
              ]
                        }
          },
                    {
                        "name": "usrp_ethernet_device001:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+usrp_ethernet_device001:if0",
                        "uuid": "762cdbd8-6b85-421b-9044-25f3cde606b3",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "usrp_ethernet_device_id": 1785,
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+63a9257a-f2cd-42c8-a687-ad4577e009b0",
                                "uuid": "63a9257a-f2cd-42c8-a687-ad4577e009b0",
                                "resource_type": "ip",
                                "address": "192.168.10.2",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ],
                        "link": {
                            "name": "link001",
                            "uuid": "fdf7e3d1-e8e0-4d58-8e40-a618c27bae0f",
                            "urn": "urn:publicid:IDN+omf:testserver+link+link001",
                            "resource_type": "link",
                            "exclusive": true,
                            "connects": [
                                {
                                    "name": "node016",
                                    "urn": "urn:publicid:IDN+omf:testserver+node+node016",
                                    "uuid": "c5e5c8e3-3bb5-4312-bece-876538cbce58",
                                    "resource_type": "node",
                                    "domain": "omf:nitos.indoor",
                                    "available": true,
                                    "exclusive": true,
                                    "hardware_type": "PC-Grid",
                                    "hostname": "node016",
                                    "ram": "1.8905 GB",
                                    "ram_type": "DIMM Synchronous",
                                    "hd_capacity": "59.6263 GB",
                                    "monitored": true,
                                    "gateway": "10.64.44.30"
                },
                                {
                                    "name": "usrp_ethernet_device001",
                                    "urn": "urn:publicid:IDN+omf:nitlab.indoor+lte_dongle+usrp_ethernet_device001",
                                    "uuid": "9ac90c6c-4d83-4252-b2b3-8910095394c4",
                                    "resource_type": "usrpethernetdevice",
                                    "domain": "omf:nitlab.indoor",
                                    "exclusive": true,
                                    "operating_frequency": "70 MHz - 6 GHz",
                                    "cpu_model": "Xilinx Spartan 6 XC6SLX150",
                                    "antennas": "tx0: 2.4-5 GHz, rx0: 2.4-5 GHz",
                                    "base_model": "B210",
                                    "vendor": "Ettus Research",
                                    "number_of_antennas": "SISO 1x1"
                }
              ]
                        }
          }
        ],
                "exclusive": true
      },
            {
                "name": "link001:node052-usrp_ethernet_device001",
                "urn": "urn:publicid:IDN+omf:testserver+link+link001:node052-usrp_ethernet_device001",
                "uuid": "96e64969-c140-434f-9a7a-7f5dd281ad49",
                "resource_type": "link",
                "interfaces": [

        ]
      },
            {
                "name": "link001:node064-usrp_ethernet_device003",
                "urn": "urn:publicid:IDN+omf:testserver+link+link001:node064-usrp_ethernet_device003",
                "uuid": "f604a2da-5420-4ebe-a7c6-9c9ef50b440c",
                "resource_type": "link",
                "interfaces": [

        ]
      },
            {
                "name": "node051",
                "urn": "urn:publicid:IDN+omf:testserver+node+node051",
                "uuid": "f8520e47-3034-4a92-8a88-7e5c5dfe6705",
                "resource_type": "node",
                "interfaces": [
                    {
                        "name": "node051:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node051:if0",
                        "uuid": "1520240d-3b49-4a1e-8b3a-aadf0a4ed3be",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "mac": "fc-aa-14-e4-06-71",
                        "description": "1 Gbps ethernet",
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+0f84452f-1afc-447a-9df6-41ce51478a95",
                                "uuid": "0f84452f-1afc-447a-9df6-41ce51478a95",
                                "resource_type": "ip",
                                "address": "10.0.1.1",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ]
          },
                    {
                        "name": "node051:if1",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node051:if1",
                        "uuid": "07070c06-27a2-4d56-aa6b-b11425c40107",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "experimental",
                        "mac": "fc-aa-14-06-72",
                        "description": "1 Gbps ethernet"
          }
        ],
                "cpus": [
                    {
                        "urn": "urn:publicid:IDN+omf:testserver+cpu+25fa3a9a-e8da-4d63-8052-121f1d8e08b7",
                        "uuid": "25fa3a9a-e8da-4d63-8052-121f1d8e08b7",
                        "resource_type": "cpu",
                        "exclusive": true,
                        "node_id": 1815,
                        "cpu_type": "AMD Geode LX800 @ 500 MHz",
                        "cores": 1,
                        "threads": 1,
                        "cache_l1": "0 KB",
                        "cache_l2": "0 MB"
          }
        ],
                "cmc": {
                    "name": "node051:cm",
                    "urn": "urn:publicid:IDN+omf:testserver+cmc+node051:cm",
                    "uuid": "83c630ad-e10e-487e-a16c-9f2335667b23",
                    "resource_type": "cmc",
                    "exclusive": true,
                    "mac": "09:A2:DA:0D:F0:01",
                    "ip": {
                        "urn": "urn:publicid:IDN+omf:testserver+ip+06949bbd-80d5-44a6-b9a8-c328f41080f4",
                        "uuid": "06949bbd-80d5-44a6-b9a8-c328f41080f4",
                        "resource_type": "ip",
                        "address": "10.1.0.1",
                        "netmask": "255.255.255.0",
                        "ip_type": "ipv4"
                    }
                }
      },
            {
                "name": "node052",
                "urn": "urn:publicid:IDN+omf:testserver+node+node052",
                "uuid": "f9ca2e3c-570f-498e-85ae-b8e3259f016b",
                "resource_type": "node",
                "interfaces": [
                    {
                        "name": "node052:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node052:if0",
                        "uuid": "515094b9-1dff-413e-bbfa-0321163fb419",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "mac": "fc-aa-14-e3-f7-e1",
                        "description": "1 Gbps ethernet",
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+6c3d37cd-06b5-4204-90c7-3c8064d74c70",
                                "uuid": "6c3d37cd-06b5-4204-90c7-3c8064d74c70",
                                "resource_type": "ip",
                                "address": "10.0.1.2",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ]
          },
                    {
                        "name": "node052:if1",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node052:if1",
                        "uuid": "3f52f7fa-3cee-4c8e-85fc-e24aa52da198",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "experimental",
                        "mac": "fc-aa-14-e4-97",
                        "description": "1 Gbps ethernet"
          }
        ],
                "cpus": [
                    {
                        "urn": "urn:publicid:IDN+omf:testserver+cpu+a5db1eba-b337-41ec-8fb4-f9a63700df2a",
                        "uuid": "a5db1eba-b337-41ec-8fb4-f9a63700df2a",
                        "resource_type": "cpu",
                        "exclusive": true,
                        "node_id": 1822,
                        "cpu_type": "AMD Geode LX800 @ 500 MHz",
                        "cores": 1,
                        "threads": 1,
                        "cache_l1": "0 KB",
                        "cache_l2": "0 MB"
          }
        ],
                "cmc": {
                    "name": "node052:cm",
                    "urn": "urn:publicid:IDN+omf:testserver+cmc+node052:cm",
                    "uuid": "70f6bb00-e59f-478b-ad2c-67fff9e602de",
                    "resource_type": "cmc",
                    "exclusive": true,
                    "mac": "09:A2:DA:0D:F0:02",
                    "ip": {
                        "urn": "urn:publicid:IDN+omf:testserver+ip+46b05848-eef0-4e72-b402-376f11ed1122",
                        "uuid": "46b05848-eef0-4e72-b402-376f11ed1122",
                        "resource_type": "ip",
                        "address": "10.1.0.2",
                        "netmask": "255.255.255.0",
                        "ip_type": "ipv4"
                    }
                }
      },
            {
                "name": "node053",
                "urn": "urn:publicid:IDN+omf:testserver+node+node053",
                "uuid": "f82f46b3-5ea2-4e12-8f06-efac7fcf1972",
                "resource_type": "node",
                "interfaces": [
                    {
                        "name": "node053:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node053:if0",
                        "uuid": "44ecb665-898f-459e-942c-e1f9bcd6a8a7",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "mac": "fc-aa-14-e4-c2-b8",
                        "description": "1 Gbps ethernet",
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+771ce2f4-ce1c-4cf5-94c3-25efbff782d9",
                                "uuid": "771ce2f4-ce1c-4cf5-94c3-25efbff782d9",
                                "resource_type": "ip",
                                "address": "10.0.1.3",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ]
          },
                    {
                        "name": "node053:if1",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node053:if1",
                        "uuid": "4b4df8e5-fa55-41f3-838b-d43cc7c7096d",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "experimental",
                        "mac": "fc-aa-14-e4-97",
                        "description": "1 Gbps ethernet"
          }
        ],
                "cpus": [
                    {
                        "urn": "urn:publicid:IDN+omf:testserver+cpu+c253500d-089f-471d-bf07-aa5aad552dd1",
                        "uuid": "c253500d-089f-471d-bf07-aa5aad552dd1",
                        "resource_type": "cpu",
                        "exclusive": true,
                        "node_id": 1829,
                        "cpu_type": "AMD Geode LX800 @ 500 MHz",
                        "cores": 1,
                        "threads": 1,
                        "cache_l1": "0 KB",
                        "cache_l2": "0 MB"
          }
        ],
                "cmc": {
                    "name": "node053:cm",
                    "urn": "urn:publicid:IDN+omf:testserver+cmc+node053:cm",
                    "uuid": "726eeca3-5a97-4303-aa39-39c7abd6c0a0",
                    "resource_type": "cmc",
                    "exclusive": true,
                    "mac": "09:A2:DA:0D:F0:03",
                    "ip": {
                        "urn": "urn:publicid:IDN+omf:testserver+ip+47233447-14f3-4126-b43c-2bdeb3ebdeff",
                        "uuid": "47233447-14f3-4126-b43c-2bdeb3ebdeff",
                        "resource_type": "ip",
                        "address": "10.1.0.3",
                        "netmask": "255.255.255.0",
                        "ip_type": "ipv4"
                    }
                }
      },
            {
                "name": "node054",
                "urn": "urn:publicid:IDN+omf:testserver+node+node054",
                "uuid": "52d87fd7-e5ec-4290-99a5-4653978f42e5",
                "resource_type": "node",
                "interfaces": [
                    {
                        "name": "node054:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node054:if0",
                        "uuid": "eeaa7281-93c1-492b-b440-883fe64e850c",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "mac": "fc-aa-14-e3-f7-c0",
                        "description": "1 Gbps ethernet",
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+ad36ddb9-4c1d-4ea4-83de-9f1535646531",
                                "uuid": "ad36ddb9-4c1d-4ea4-83de-9f1535646531",
                                "resource_type": "ip",
                                "address": "10.0.1.4",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ]
          },
                    {
                        "name": "node054:if1",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node054:if1",
                        "uuid": "ec6085d0-c874-44cb-b5f0-22ef9aa55c46",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "experimental",
                        "mac": "fc-aa-14-e4-97",
                        "description": "1 Gbps ethernet"
          }
        ],
                "cpus": [
                    {
                        "urn": "urn:publicid:IDN+omf:testserver+cpu+ab3ba74d-4f59-42c3-a6f3-7e5b504abc0d",
                        "uuid": "ab3ba74d-4f59-42c3-a6f3-7e5b504abc0d",
                        "resource_type": "cpu",
                        "exclusive": true,
                        "node_id": 1836,
                        "cpu_type": "AMD Geode LX800 @ 500 MHz",
                        "cores": 1,
                        "threads": 1,
                        "cache_l1": "0 KB",
                        "cache_l2": "0 MB"
          }
        ],
                "cmc": {
                    "name": "node054:cm",
                    "urn": "urn:publicid:IDN+omf:testserver+cmc+node054:cm",
                    "uuid": "a0610ac3-addb-44e7-91b6-228e3008a4c8",
                    "resource_type": "cmc",
                    "exclusive": true,
                    "mac": "09:A2:DA:0D:F0:04",
                    "ip": {
                        "urn": "urn:publicid:IDN+omf:testserver+ip+5a4c6e8d-975d-441b-82cc-800480d7c293",
                        "uuid": "5a4c6e8d-975d-441b-82cc-800480d7c293",
                        "resource_type": "ip",
                        "address": "10.1.0.4",
                        "netmask": "255.255.255.0",
                        "ip_type": "ipv4"
                    }
                }
      },
            {
                "name": "node055",
                "urn": "urn:publicid:IDN+omf:testserver+node+node055",
                "uuid": "71321d51-40c2-4c79-ae3a-abc806231727",
                "resource_type": "node",
                "interfaces": [
                    {
                        "name": "node055:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node055:if0",
                        "uuid": "698cc29f-0b4a-4e62-bb63-5c663871b190",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "mac": "fc-aa-14-e3-f9-29",
                        "description": "1 Gbps ethernet",
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+c690ad7c-9132-4453-9a42-0be1bf80eea3",
                                "uuid": "c690ad7c-9132-4453-9a42-0be1bf80eea3",
                                "resource_type": "ip",
                                "address": "10.0.1.5",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ]
          },
                    {
                        "name": "node055:if1",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node055:if1",
                        "uuid": "ff49e468-cece-45c6-b27e-6dedf9e8030f",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "experimental",
                        "mac": "fc-aa-14-e4-97",
                        "description": "1 Gbps ethernet"
          }
        ],
                "cpus": [
                    {
                        "urn": "urn:publicid:IDN+omf:testserver+cpu+ee671b55-015d-450c-8055-12351ebddb62",
                        "uuid": "ee671b55-015d-450c-8055-12351ebddb62",
                        "resource_type": "cpu",
                        "exclusive": true,
                        "node_id": 1843,
                        "cpu_type": "AMD Geode LX800 @ 500 MHz",
                        "cores": 1,
                        "threads": 1,
                        "cache_l1": "0 KB",
                        "cache_l2": "0 MB"
          }
        ],
                "cmc": {
                    "name": "node055:cm",
                    "urn": "urn:publicid:IDN+omf:testserver+cmc+node055:cm",
                    "uuid": "9bbbe77d-aed4-400e-88a5-f13ddcf6e1e3",
                    "resource_type": "cmc",
                    "exclusive": true,
                    "mac": "09:A2:DA:0D:F0:05",
                    "ip": {
                        "urn": "urn:publicid:IDN+omf:testserver+ip+c687d0ae-3c95-4062-90db-d48eac369cf0",
                        "uuid": "c687d0ae-3c95-4062-90db-d48eac369cf0",
                        "resource_type": "ip",
                        "address": "10.1.0.5",
                        "netmask": "255.255.255.0",
                        "ip_type": "ipv4"
                    }
                }
      },
            {
                "name": "node056",
                "urn": "urn:publicid:IDN+omf:testserver+node+node056",
                "uuid": "d98c67ab-efe2-4eb4-807b-159de81a2505",
                "resource_type": "node",
                "interfaces": [
                    {
                        "name": "node056:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node056:if0",
                        "uuid": "a7b79a5d-0928-4d42-a6c4-84200170e3e2",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "mac": "fc-aa-14-e4-10-f7",
                        "description": "1 Gbps ethernet",
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+42a3ebc7-69ad-4b1a-9eed-7afb536bf98a",
                                "uuid": "42a3ebc7-69ad-4b1a-9eed-7afb536bf98a",
                                "resource_type": "ip",
                                "address": "10.0.1.6",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ]
          },
                    {
                        "name": "node056:if1",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node056:if1",
                        "uuid": "85b905b4-da68-45c2-9f4b-6e4478ac9031",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "experimental",
                        "mac": "fc-aa-14-e4-97",
                        "description": "1 Gbps ethernet"
          }
        ],
                "cpus": [
                    {
                        "urn": "urn:publicid:IDN+omf:testserver+cpu+06aff6f8-0d48-4843-bc0c-92b4a3506026",
                        "uuid": "06aff6f8-0d48-4843-bc0c-92b4a3506026",
                        "resource_type": "cpu",
                        "exclusive": true,
                        "node_id": 1850,
                        "cpu_type": "AMD Geode LX800 @ 500 MHz",
                        "cores": 1,
                        "threads": 1,
                        "cache_l1": "0 KB",
                        "cache_l2": "0 MB"
          }
        ],
                "cmc": {
                    "name": "node056:cm",
                    "urn": "urn:publicid:IDN+omf:testserver+cmc+node056:cm",
                    "uuid": "64d9d6fd-0d5b-4c0a-8690-849de227e5db",
                    "resource_type": "cmc",
                    "exclusive": true,
                    "mac": "09:A2:DA:0D:F0:06",
                    "ip": {
                        "urn": "urn:publicid:IDN+omf:testserver+ip+e9a1c9e4-be3c-454d-94b5-17e07acee13c",
                        "uuid": "e9a1c9e4-be3c-454d-94b5-17e07acee13c",
                        "resource_type": "ip",
                        "address": "10.1.0.6",
                        "netmask": "255.255.255.0",
                        "ip_type": "ipv4"
                    }
                }
      },
            {
                "name": "node057",
                "urn": "urn:publicid:IDN+omf:testserver+node+node057",
                "uuid": "2e1beb52-21e3-4e5f-977c-26f46a1c5fd3",
                "resource_type": "node",
                "interfaces": [
                    {
                        "name": "node057:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node057:if0",
                        "uuid": "56890e25-eba6-4916-b99c-4fbda07f74de",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "mac": "fc-aa-14-e4-11-03",
                        "description": "1 Gbps ethernet",
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+08ee9bf9-2968-4cf8-97c1-bd9622e06ba8",
                                "uuid": "08ee9bf9-2968-4cf8-97c1-bd9622e06ba8",
                                "resource_type": "ip",
                                "address": "10.0.1.7",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ]
          },
                    {
                        "name": "node057:if1",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node057:if1",
                        "uuid": "ec19a9ba-5827-40b6-9de1-2d5b6789d3c9",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "experimental",
                        "mac": "fc-aa-14-e4-97",
                        "description": "1 Gbps ethernet"
          }
        ],
                "cpus": [
                    {
                        "urn": "urn:publicid:IDN+omf:testserver+cpu+daceb04a-9c19-4cb1-9d58-e23d9bfc98b2",
                        "uuid": "daceb04a-9c19-4cb1-9d58-e23d9bfc98b2",
                        "resource_type": "cpu",
                        "exclusive": true,
                        "node_id": 1857,
                        "cpu_type": "AMD Geode LX800 @ 500 MHz",
                        "cores": 1,
                        "threads": 1,
                        "cache_l1": "0 KB",
                        "cache_l2": "0 MB"
          }
        ],
                "cmc": {
                    "name": "node057:cm",
                    "urn": "urn:publicid:IDN+omf:testserver+cmc+node057:cm",
                    "uuid": "84dbf9a8-1552-45a6-87f5-382ae197d2f1",
                    "resource_type": "cmc",
                    "exclusive": true,
                    "mac": "09:A2:DA:0D:F0:07",
                    "ip": {
                        "urn": "urn:publicid:IDN+omf:testserver+ip+356212d9-1691-43e6-8e1d-06e80371c7da",
                        "uuid": "356212d9-1691-43e6-8e1d-06e80371c7da",
                        "resource_type": "ip",
                        "address": "10.1.0.7",
                        "netmask": "255.255.255.0",
                        "ip_type": "ipv4"
                    }
                }
      },
            {
                "name": "node058",
                "urn": "urn:publicid:IDN+omf:testserver+node+node058",
                "uuid": "9305bb74-e14f-4c79-8bb7-4a76a77c122f",
                "resource_type": "node",
                "interfaces": [
                    {
                        "name": "node058:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node058:if0",
                        "uuid": "b6791a18-dcfa-4c95-b075-81b348957319",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "mac": "fc-aa-14-e4-10-fb",
                        "description": "1 Gbps ethernet",
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+2df684d0-3199-4113-9564-d928419bfeab",
                                "uuid": "2df684d0-3199-4113-9564-d928419bfeab",
                                "resource_type": "ip",
                                "address": "10.0.1.8",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ]
          },
                    {
                        "name": "node058:if1",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node058:if1",
                        "uuid": "f332f2b3-b354-42a3-a1ba-5774def65b21",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "experimental",
                        "mac": "fc-aa-14-e4-97",
                        "description": "1 Gbps ethernet"
          }
        ],
                "cpus": [
                    {
                        "urn": "urn:publicid:IDN+omf:testserver+cpu+5b5af08d-6bb9-4c61-a22a-0846a58d0752",
                        "uuid": "5b5af08d-6bb9-4c61-a22a-0846a58d0752",
                        "resource_type": "cpu",
                        "exclusive": true,
                        "node_id": 1864,
                        "cpu_type": "AMD Geode LX800 @ 500 MHz",
                        "cores": 1,
                        "threads": 1,
                        "cache_l1": "0 KB",
                        "cache_l2": "0 MB"
          }
        ],
                "cmc": {
                    "name": "node058:cm",
                    "urn": "urn:publicid:IDN+omf:testserver+cmc+node058:cm",
                    "uuid": "5641d859-3fb4-46b8-ac8a-9dfa659559f3",
                    "resource_type": "cmc",
                    "exclusive": true,
                    "mac": "09:A2:DA:0D:F0:08",
                    "ip": {
                        "urn": "urn:publicid:IDN+omf:testserver+ip+3c7fb5ad-2928-4001-bc2f-d1ec6b21d66c",
                        "uuid": "3c7fb5ad-2928-4001-bc2f-d1ec6b21d66c",
                        "resource_type": "ip",
                        "address": "10.1.0.8",
                        "netmask": "255.255.255.0",
                        "ip_type": "ipv4"
                    }
                }
      },
            {
                "name": "node059",
                "urn": "urn:publicid:IDN+omf:testserver+node+node059",
                "uuid": "1ae1bd86-a372-4e7e-a250-a9c5ef5dd930",
                "resource_type": "node",
                "interfaces": [
                    {
                        "name": "node059:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node059:if0",
                        "uuid": "a3cebf0d-cf8d-407b-bfa6-e7c239e603a5",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "mac": "fc-aa-14-e4-17-55",
                        "description": "1 Gbps ethernet",
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+cbce2cfe-6e15-4589-9ef4-c33e98a8e9fb",
                                "uuid": "cbce2cfe-6e15-4589-9ef4-c33e98a8e9fb",
                                "resource_type": "ip",
                                "address": "10.0.1.9",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ]
          },
                    {
                        "name": "node059:if1",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node059:if1",
                        "uuid": "d81da712-63fb-4942-a8f1-b02a9763a4f8",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "experimental",
                        "mac": "fc-aa-14-e4-97",
                        "description": "1 Gbps ethernet"
          }
        ],
                "cpus": [
                    {
                        "urn": "urn:publicid:IDN+omf:testserver+cpu+cad58702-e4c6-4685-9856-67c5f939e0a5",
                        "uuid": "cad58702-e4c6-4685-9856-67c5f939e0a5",
                        "resource_type": "cpu",
                        "exclusive": true,
                        "node_id": 1871,
                        "cpu_type": "AMD Geode LX800 @ 500 MHz",
                        "cores": 1,
                        "threads": 1,
                        "cache_l1": "0 KB",
                        "cache_l2": "0 MB"
          }
        ],
                "cmc": {
                    "name": "node059:cm",
                    "urn": "urn:publicid:IDN+omf:testserver+cmc+node059:cm",
                    "uuid": "9af6be1a-cd18-4ba5-9467-80bb4c3fc84a",
                    "resource_type": "cmc",
                    "exclusive": true,
                    "mac": "09:A2:DA:0D:F0:09",
                    "ip": {
                        "urn": "urn:publicid:IDN+omf:testserver+ip+460fa4c8-fda1-4873-81f5-1de56172b1ec",
                        "uuid": "460fa4c8-fda1-4873-81f5-1de56172b1ec",
                        "resource_type": "ip",
                        "address": "10.1.0.9",
                        "netmask": "255.255.255.0",
                        "ip_type": "ipv4"
                    }
                }
      },
            {
                "name": "node060",
                "urn": "urn:publicid:IDN+omf:testserver+node+node060",
                "uuid": "3720e626-e7c8-4bd3-b977-c31c3c39b005",
                "resource_type": "node",
                "interfaces": [
                    {
                        "name": "node060:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node060:if0",
                        "uuid": "cd438914-0237-4821-807a-7cbf00d87040",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "mac": "fc-aa-14-e4-17-2d",
                        "description": "1 Gbps ethernet",
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+8c4d7fa2-5c39-4018-a267-6a2d377e65a3",
                                "uuid": "8c4d7fa2-5c39-4018-a267-6a2d377e65a3",
                                "resource_type": "ip",
                                "address": "10.0.1.10",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ]
          },
                    {
                        "name": "node060:if1",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node060:if1",
                        "uuid": "b4d9e7b9-c732-4eca-8a38-bd103173c112",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "experimental",
                        "mac": "fc-aa-14-e4-97",
                        "description": "1 Gbps ethernet"
          }
        ],
                "cpus": [
                    {
                        "urn": "urn:publicid:IDN+omf:testserver+cpu+1dc0d651-48b4-4c86-a582-5ca83b1bb928",
                        "uuid": "1dc0d651-48b4-4c86-a582-5ca83b1bb928",
                        "resource_type": "cpu",
                        "exclusive": true,
                        "node_id": 1878,
                        "cpu_type": "AMD Geode LX800 @ 500 MHz",
                        "cores": 1,
                        "threads": 1,
                        "cache_l1": "0 KB",
                        "cache_l2": "0 MB"
          }
        ],
                "cmc": {
                    "name": "node060:cm",
                    "urn": "urn:publicid:IDN+omf:testserver+cmc+node060:cm",
                    "uuid": "94573074-65e9-4b9d-814e-2a301510d69b",
                    "resource_type": "cmc",
                    "exclusive": true,
                    "mac": "09:A2:DA:0D:F0:60",
                    "ip": {
                        "urn": "urn:publicid:IDN+omf:testserver+ip+e0c55b33-45cb-4bc4-88f4-07d0bc0699e7",
                        "uuid": "e0c55b33-45cb-4bc4-88f4-07d0bc0699e7",
                        "resource_type": "ip",
                        "address": "10.1.0.10",
                        "netmask": "255.255.255.0",
                        "ip_type": "ipv4"
                    }
                }
      },
            {
                "name": "node061",
                "urn": "urn:publicid:IDN+omf:testserver+node+node061",
                "uuid": "0b2c2c2d-b995-4f6a-a7f3-063a298aa01c",
                "resource_type": "node",
                "interfaces": [
                    {
                        "name": "node061:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node061:if0",
                        "uuid": "3de77dcb-85b5-4940-b4cb-c584f6480933",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "mac": "fc-aa-14-e4-96",
                        "description": "1 Gbps ethernet",
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+beca77dc-15fb-4ae3-a819-c54488301795",
                                "uuid": "beca77dc-15fb-4ae3-a819-c54488301795",
                                "resource_type": "ip",
                                "address": "10.0.1.61",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ]
          },
                    {
                        "name": "node061:if1",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node061:if1",
                        "uuid": "aed9304c-a365-48fe-bebe-0683be6850a6",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "experimental",
                        "mac": "fc-aa-14-e4-97",
                        "description": "1 Gbps ethernet"
          }
        ],
                "cpus": [
                    {
                        "urn": "urn:publicid:IDN+omf:testserver+cpu+5b848258-b88f-40f2-907a-73abafa4e079",
                        "uuid": "5b848258-b88f-40f2-907a-73abafa4e079",
                        "resource_type": "cpu",
                        "exclusive": true,
                        "node_id": 1885,
                        "cpu_type": "AMD Geode LX800 @ 500 MHz",
                        "cores": 1,
                        "threads": 1,
                        "cache_l1": "0 KB",
                        "cache_l2": "0 MB"
          }
        ],
                "cmc": {
                    "name": "node061:cm",
                    "urn": "urn:publicid:IDN+omf:testserver+cmc+node061:cm",
                    "uuid": "c159b36c-90c2-46d9-ae01-ebd869902efb",
                    "resource_type": "cmc",
                    "exclusive": true,
                    "mac": "09:A2:DA:0D:F0:61",
                    "ip": {
                        "urn": "urn:publicid:IDN+omf:testserver+ip+6332cee0-c04d-44ac-ab78-331c28707c5e",
                        "uuid": "6332cee0-c04d-44ac-ab78-331c28707c5e",
                        "resource_type": "ip",
                        "address": "10.1.0.61",
                        "netmask": "255.255.255.0",
                        "ip_type": "ipv4"
                    }
                }
      },
            {
                "name": "node062",
                "urn": "urn:publicid:IDN+omf:testserver+node+node062",
                "uuid": "1dd50fad-b5dc-453a-86a7-6f66450472fc",
                "resource_type": "node",
                "interfaces": [
                    {
                        "name": "node062:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node062:if0",
                        "uuid": "c90b6c79-b886-41d6-a803-b9882dd1b375",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "mac": "fc-aa-14-e4-96",
                        "description": "1 Gbps ethernet",
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+85ce28fb-13a2-4a73-9a81-9f9ca59885b4",
                                "uuid": "85ce28fb-13a2-4a73-9a81-9f9ca59885b4",
                                "resource_type": "ip",
                                "address": "10.0.1.62",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ]
          },
                    {
                        "name": "node062:if1",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node062:if1",
                        "uuid": "9bb1cf4e-8426-4656-a404-a606aae4ad69",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "experimental",
                        "mac": "fc-aa-14-e4-97",
                        "description": "1 Gbps ethernet"
          }
        ],
                "cpus": [
                    {
                        "urn": "urn:publicid:IDN+omf:testserver+cpu+39d15506-ebf0-4f47-a3bc-65052af194a2",
                        "uuid": "39d15506-ebf0-4f47-a3bc-65052af194a2",
                        "resource_type": "cpu",
                        "exclusive": true,
                        "node_id": 1892,
                        "cpu_type": "AMD Geode LX800 @ 500 MHz",
                        "cores": 1,
                        "threads": 1,
                        "cache_l1": "0 KB",
                        "cache_l2": "0 MB"
          }
        ],
                "cmc": {
                    "name": "node062:cm",
                    "urn": "urn:publicid:IDN+omf:testserver+cmc+node062:cm",
                    "uuid": "cc866820-a884-4d28-a633-f6b9d3a103e9",
                    "resource_type": "cmc",
                    "exclusive": true,
                    "mac": "09:A2:DA:0D:F0:62",
                    "ip": {
                        "urn": "urn:publicid:IDN+omf:testserver+ip+1f840a07-7887-4a6a-8165-e5947ffb4bc0",
                        "uuid": "1f840a07-7887-4a6a-8165-e5947ffb4bc0",
                        "resource_type": "ip",
                        "address": "10.1.0.62",
                        "netmask": "255.255.255.0",
                        "ip_type": "ipv4"
                    }
                }
      },
            {
                "name": "node063",
                "urn": "urn:publicid:IDN+omf:testserver+node+node063",
                "uuid": "15a16cb0-7ca2-407d-b9c6-73076a0793c6",
                "resource_type": "node",
                "interfaces": [
                    {
                        "name": "node063:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node063:if0",
                        "uuid": "4fd76a23-6890-401d-9571-3d538002fc1d",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "mac": "fc-aa-14-e4-96",
                        "description": "1 Gbps ethernet",
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+274fc6d9-05cd-40d1-a5ee-b2f3b8ece128",
                                "uuid": "274fc6d9-05cd-40d1-a5ee-b2f3b8ece128",
                                "resource_type": "ip",
                                "address": "10.0.1.63",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ]
          },
                    {
                        "name": "node063:if1",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node063:if1",
                        "uuid": "8f14ea06-2641-4550-bff5-30af625dcca6",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "experimental",
                        "mac": "fc-aa-14-e4-97",
                        "description": "1 Gbps ethernet"
          }
        ],
                "cpus": [
                    {
                        "urn": "urn:publicid:IDN+omf:testserver+cpu+85aac3cb-9c89-4cc3-9379-aa0b67fbca16",
                        "uuid": "85aac3cb-9c89-4cc3-9379-aa0b67fbca16",
                        "resource_type": "cpu",
                        "exclusive": true,
                        "node_id": 1899,
                        "cpu_type": "AMD Geode LX800 @ 500 MHz",
                        "cores": 1,
                        "threads": 1,
                        "cache_l1": "0 KB",
                        "cache_l2": "0 MB"
          }
        ],
                "cmc": {
                    "name": "node063:cm",
                    "urn": "urn:publicid:IDN+omf:testserver+cmc+node063:cm",
                    "uuid": "1e89265e-8b0f-4da1-9ae2-6893b13a748d",
                    "resource_type": "cmc",
                    "exclusive": true,
                    "mac": "09:A2:DA:0D:F0:63",
                    "ip": {
                        "urn": "urn:publicid:IDN+omf:testserver+ip+6e971886-d6bb-4010-b8ea-1b1819138c6f",
                        "uuid": "6e971886-d6bb-4010-b8ea-1b1819138c6f",
                        "resource_type": "ip",
                        "address": "10.1.0.63",
                        "netmask": "255.255.255.0",
                        "ip_type": "ipv4"
                    }
                }
      },
            {
                "name": "node064",
                "urn": "urn:publicid:IDN+omf:testserver+node+node064",
                "uuid": "2ba987dc-ca8d-48ba-835a-deb905b92f88",
                "resource_type": "node",
                "interfaces": [
                    {
                        "name": "node064:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node064:if0",
                        "uuid": "726948f8-ad2b-4ace-828e-10ff813f6787",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "mac": "fc-aa-14-e4-96",
                        "description": "1 Gbps ethernet",
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+472ad12e-96c5-4853-ab8b-90ffc60731c9",
                                "uuid": "472ad12e-96c5-4853-ab8b-90ffc60731c9",
                                "resource_type": "ip",
                                "address": "10.0.1.64",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ]
          },
                    {
                        "name": "node064:if1",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node064:if1",
                        "uuid": "3ea86691-2e99-49c3-bffe-6877065730cc",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "experimental",
                        "mac": "fc-aa-14-e4-97",
                        "description": "1 Gbps ethernet"
          }
        ],
                "cpus": [
                    {
                        "urn": "urn:publicid:IDN+omf:testserver+cpu+8128820f-b2c6-4faa-8983-ecc7c36e3a21",
                        "uuid": "8128820f-b2c6-4faa-8983-ecc7c36e3a21",
                        "resource_type": "cpu",
                        "exclusive": true,
                        "node_id": 1906,
                        "cpu_type": "AMD Geode LX800 @ 500 MHz",
                        "cores": 1,
                        "threads": 1,
                        "cache_l1": "0 KB",
                        "cache_l2": "0 MB"
          }
        ],
                "cmc": {
                    "name": "node064:cm",
                    "urn": "urn:publicid:IDN+omf:testserver+cmc+node064:cm",
                    "uuid": "fd8d8069-d67f-4d94-8873-ff92bddbb598",
                    "resource_type": "cmc",
                    "exclusive": true,
                    "mac": "09:A2:DA:0D:F0:64",
                    "ip": {
                        "urn": "urn:publicid:IDN+omf:testserver+ip+0df250d3-3a7a-4207-b6ef-0e3d973efead",
                        "uuid": "0df250d3-3a7a-4207-b6ef-0e3d973efead",
                        "resource_type": "ip",
                        "address": "10.1.0.64",
                        "netmask": "255.255.255.0",
                        "ip_type": "ipv4"
                    }
                }
      },
            {
                "name": "node071",
                "urn": "urn:publicid:IDN+omf:testserver+node+node071",
                "uuid": "31b7166d-fe53-49ea-91a5-1287c362b35c",
                "resource_type": "node",
                "interfaces": [
                    {
                        "name": "node071:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node071:if0",
                        "uuid": "3b45dd0e-607c-4d37-927b-ae357148e7f5",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "mac": "fc-aa-14-e3-f8-dc",
                        "description": "1 Gbps ethernet",
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+6c63973a-6453-415b-a3e8-10c5129f8af5",
                                "uuid": "6c63973a-6453-415b-a3e8-10c5129f8af5",
                                "resource_type": "ip",
                                "address": "10.0.1.11",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ]
          },
                    {
                        "name": "node071:if1",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node071:if1",
                        "uuid": "86825e71-5080-4584-9b6d-4e06f7469920",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "experimental",
                        "mac": "fc-aa-14-e3-f8-c8",
                        "description": "1 Gbps ethernet"
          }
        ],
                "cpus": [
                    {
                        "urn": "urn:publicid:IDN+omf:testserver+cpu+1b1fe108-f4de-417d-bb3e-8ec8d855a52e",
                        "uuid": "1b1fe108-f4de-417d-bb3e-8ec8d855a52e",
                        "resource_type": "cpu",
                        "exclusive": true,
                        "node_id": 1913,
                        "cpu_type": "AMD Geode LX800 @ 500 MHz",
                        "cores": 1,
                        "threads": 1,
                        "cache_l1": "0 KB",
                        "cache_l2": "0 MB"
          }
        ],
                "cmc": {
                    "name": "node071:cm",
                    "urn": "urn:publicid:IDN+omf:testserver+cmc+node071:cm",
                    "uuid": "eb088f5b-e57f-412a-be2c-43a0e1927c79",
                    "resource_type": "cmc",
                    "exclusive": true,
                    "mac": "09:A2:DA:0D:F0:11",
                    "ip": {
                        "urn": "urn:publicid:IDN+omf:testserver+ip+db915467-d56a-4ef8-877b-84af39d9e3c9",
                        "uuid": "db915467-d56a-4ef8-877b-84af39d9e3c9",
                        "resource_type": "ip",
                        "address": "10.1.0.11",
                        "netmask": "255.255.255.0",
                        "ip_type": "ipv4"
                    }
                }
      },
            {
                "name": "node072",
                "urn": "urn:publicid:IDN+omf:testserver+node+node072",
                "uuid": "d6555421-83e2-4336-b0a5-b0b5a1f0ae81",
                "resource_type": "node",
                "interfaces": [
                    {
                        "name": "node072:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node072:if0",
                        "uuid": "08941f6c-4f4e-4639-bae0-718072bbfa3f",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "mac": "fc-aa-14-e4-c2-d2",
                        "description": "1 Gbps ethernet",
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+aba875a2-8fc2-4518-89a0-e1ea088ae598",
                                "uuid": "aba875a2-8fc2-4518-89a0-e1ea088ae598",
                                "resource_type": "ip",
                                "address": "10.0.1.12",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ]
          },
                    {
                        "name": "node072:if1",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node072:if1",
                        "uuid": "bfd67b78-7b3e-4c47-9ea6-219eedff51b3",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "experimental",
                        "mac": "fc-aa-14-e4-c2-d0",
                        "description": "1 Gbps ethernet"
          }
        ],
                "cpus": [
                    {
                        "urn": "urn:publicid:IDN+omf:testserver+cpu+31c7df6d-8cbc-4f1e-88bb-ef7021b5c9d2",
                        "uuid": "31c7df6d-8cbc-4f1e-88bb-ef7021b5c9d2",
                        "resource_type": "cpu",
                        "exclusive": true,
                        "node_id": 1920,
                        "cpu_type": "AMD Geode LX800 @ 500 MHz",
                        "cores": 1,
                        "threads": 1,
                        "cache_l1": "0 KB",
                        "cache_l2": "0 MB"
          }
        ],
                "cmc": {
                    "name": "node072:cm",
                    "urn": "urn:publicid:IDN+omf:testserver+cmc+node072:cm",
                    "uuid": "c258b73c-c2cf-4d38-a654-27085d1da371",
                    "resource_type": "cmc",
                    "exclusive": true,
                    "mac": "09:A2:DA:0D:F0:12",
                    "ip": {
                        "urn": "urn:publicid:IDN+omf:testserver+ip+2beb02f5-49a9-43f8-8bdb-c6f86c4b7502",
                        "uuid": "2beb02f5-49a9-43f8-8bdb-c6f86c4b7502",
                        "resource_type": "ip",
                        "address": "10.1.0.12",
                        "netmask": "255.255.255.0",
                        "ip_type": "ipv4"
                    }
                }
      },
            {
                "name": "node073",
                "urn": "urn:publicid:IDN+omf:testserver+node+node073",
                "uuid": "a3dd3f4e-31e7-4b6d-ab3e-d02dbab166d2",
                "resource_type": "node",
                "interfaces": [
                    {
                        "name": "node073:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node073:if0",
                        "uuid": "693346b2-f9e8-4f33-92c7-371a2ae3fede",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "mac": "fc-aa-14-e3-ff-65",
                        "description": "1 Gbps ethernet",
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+4f11323e-171f-422c-8c67-c8aa2f0c8b02",
                                "uuid": "4f11323e-171f-422c-8c67-c8aa2f0c8b02",
                                "resource_type": "ip",
                                "address": "10.0.1.13",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ]
          },
                    {
                        "name": "node073:if1",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node073:if1",
                        "uuid": "b57b05b6-f4e5-48bf-84b3-651a3ffee8aa",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "experimental",
                        "mac": "fc-aa-14-e3-ff-67",
                        "description": "1 Gbps ethernet"
          }
        ],
                "cpus": [
                    {
                        "urn": "urn:publicid:IDN+omf:testserver+cpu+94bb90c9-16e1-45e2-9a43-d38c794b7bee",
                        "uuid": "94bb90c9-16e1-45e2-9a43-d38c794b7bee",
                        "resource_type": "cpu",
                        "exclusive": true,
                        "node_id": 1927,
                        "cpu_type": "AMD Geode LX800 @ 500 MHz",
                        "cores": 1,
                        "threads": 1,
                        "cache_l1": "0 KB",
                        "cache_l2": "0 MB"
          }
        ],
                "cmc": {
                    "name": "node073:cm",
                    "urn": "urn:publicid:IDN+omf:testserver+cmc+node073:cm",
                    "uuid": "cffa2636-bacc-4e6c-b168-3c60ba14d6d2",
                    "resource_type": "cmc",
                    "exclusive": true,
                    "mac": "09:A2:DA:0D:F0:13",
                    "ip": {
                        "urn": "urn:publicid:IDN+omf:testserver+ip+860129e5-5a33-4015-be61-9c7abf83fcc6",
                        "uuid": "860129e5-5a33-4015-be61-9c7abf83fcc6",
                        "resource_type": "ip",
                        "address": "10.1.0.13",
                        "netmask": "255.255.255.0",
                        "ip_type": "ipv4"
                    }
                }
      },
            {
                "name": "node074",
                "urn": "urn:publicid:IDN+omf:testserver+node+node074",
                "uuid": "d3892439-ce4f-4806-b610-94a1aaeff8d3",
                "resource_type": "node",
                "interfaces": [
                    {
                        "name": "node074:if0",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node074:if0",
                        "uuid": "8fb65d14-5020-4a42-884f-0a54b55e3b3f",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "control",
                        "mac": "fc-aa-14-e3-f7-b8",
                        "description": "1 Gbps ethernet",
                        "ips": [
                            {
                                "urn": "urn:publicid:IDN+omf:testserver+ip+10ea9550-26ed-4e17-aa6b-1539d3eddd97",
                                "uuid": "10ea9550-26ed-4e17-aa6b-1539d3eddd97",
                                "resource_type": "ip",
                                "address": "10.0.1.14",
                                "netmask": "255.255.255.0",
                                "ip_type": "ipv4"
              }
            ]
          },
                    {
                        "name": "node074:if1",
                        "urn": "urn:publicid:IDN+omf:testserver+interface+node074:if1",
                        "uuid": "7d577f58-c7e9-42a8-9312-b60e82146f86",
                        "resource_type": "interface",
                        "exclusive": true,
                        "role": "experimental",
                        "mac": "fc-aa-14-e3-f7-ba",
                        "description": "1 Gbps ethernet"
          }
        ],
                "cpus": [
                    {
                        "urn": "urn:publicid:IDN+omf:testserver+cpu+277d65a4-e30d-4350-9ac4-c312216aa764",
                        "uuid": "277d65a4-e30d-4350-9ac4-c312216aa764",
                        "resource_type": "cpu",
                        "exclusive": true,
                        "node_id": 1934,
                        "cpu_type": "AMD Geode LX800 @ 500 MHz",
                        "cores": 1,
                        "threads": 1,
                        "cache_l1": "0 KB",
                        "cache_l2": "0 MB"
          }
        ],
                "cmc": {
                    "name": "node074:cm",
                    "urn": "urn:publicid:IDN+omf:testserver+cmc+node074:cm",
                    "uuid": "4a5b274e-2b5f-4703-8f29-b00d027cf0b4",
                    "resource_type": "cmc",
                    "exclusive": true,
                    "mac": "09:A2:DA:0D:F0:14",
                    "ip": {
                        "urn": "urn:publicid:IDN+omf:testserver+ip+18e3925c-7d3b-4299-85f2-efed345d4375",
                        "uuid": "18e3925c-7d3b-4299-85f2-efed345d4375",
                        "resource_type": "ip",
                        "address": "10.1.0.14",
                        "netmask": "255.255.255.0",
                        "ip_type": "ipv4"
                    }
                }
      },
            {
                "name": "jsmith",
                "urn": "urn:publicid:IDN+omf:testserver+user+jsmith",
                "uuid": "8982917c-0dda-443d-a91c-726a63f136d5",
                "resource_type": "user"
      }
    ],
        "about": "/resources"
    }
}
