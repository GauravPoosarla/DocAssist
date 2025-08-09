export default {
    "status": "success",
    "data": [
        {
            "_id": "68972a04ba52ad84e7f13182",
            "id": "DOCASSIST-11",
            "title": "Change the IOD FI poasting code CSK store",
            "description": "For CSK store IOD FI posting requiredBusiness want to change the cost center to be changed in IOD FI postingAs-is:Cost Center: DhoniProfit Center: FlemmingGL code: 1234To-be:Cost Center: RuturajProfit center: Shane WatsonGL code: 8907store Name: CSK storeFunding soruce: Srini ManChange required only in IOD FI posting not in PG FI posting. (In finance terms Expense FI = IOD FI)Reference ticket: ESR-97447",
            "status": "approved",
            "attachments": [],
            "comments": [
                {
                    "id": "10019",
                    "author": "Gokulakrishnan M",
                    "body": "Testing completed",
                    "created": "2025-08-09T14:36:10.533+0530"
                }
            ],
            "jira_status": "Done",
            "type": "Story",
            "createdAt": "2025-08-09T10:59:16.196Z",
            "updatedAt": "2025-08-09T11:12:16.203Z",
            "__v": 0,
            "ai": {
                "type": "Enhancement",
                "summary": "Change in cost center, profit center, and GL code for IOD FI posting for CSK store",
                "doc_suggesstion": [],
                "keywords": [
                    "IOD FI posting",
                    "cost center",
                    "CSK store"
                ],
                "service": "finance",
                "impact_location": "finance service for CSK store",
                "is_permanent": "permanent",
                "_id": "68972a0bba52ad84e7f1318b"
            }
        },
        {
            "_id": "68972a04ba52ad84e7f13183",
            "id": "DOCASSIST-7",
            "title": "Make PAN entry mandatory for all payment greater than 2 Lakh",
            "description": "Government has made a rule for all ecommerce company to collect PAN card for bill amount greater than 2 Lakhs.Add it in payment section",
            "status": "processed",
            "attachments": [
                {
                    "id": "10000",
                    "filename": "seamless-mode.png",
                    "mimeType": "image/png",
                    "contentUrl": "https://samsunghack.atlassian.net/rest/api/3/attachment/content/10000"
                }
            ],
            "comments": [
                {
                    "id": "10009",
                    "author": "Soorya Venkat",
                    "body": "Can we add it under address section ? ",
                    "created": "2025-08-08T00:12:28.188+0530"
                },
                {
                    "id": "10010",
                    "author": "Soorya Venkat",
                    "body": "No. It has to be at payment section since there could be some cashback so total price may reduce and come less than 2 Lakhs so user doesn't need to give PAN.",
                    "created": "2025-08-08T00:13:16.984+0530"
                },
                {
                    "id": "10011",
                    "author": "Soorya Venkat",
                    "body": "Understood. Can you please share mock for this",
                    "created": "2025-08-08T00:13:31.307+0530"
                },
                {
                    "id": "10012",
                    "author": "Soorya Venkat",
                    "body": "mocks attached",
                    "created": "2025-08-08T00:13:49.628+0530"
                },
                {
                    "id": "10018",
                    "author": "Gokulakrishnan M",
                    "body": "PR merged",
                    "created": "2025-08-09T14:35:34.569+0530"
                }
            ],
            "jira_status": "Done",
            "type": "Story",
            "createdAt": "2025-08-09T10:59:16.196Z",
            "updatedAt": "2025-08-09T10:59:28.878Z",
            "__v": 0,
            "ai": {
                "type": "Enhancement",
                "summary": "Mandatory PAN entry for payments exceeding 2 Lakhs added in the payment section.",
                "doc_suggesstion": [],
                "keywords": [
                    "PAN",
                    "payment",
                    "tax compliance"
                ],
                "service": "payment",
                "impact_location": "payment section",
                "is_permanent": "permanent",
                "_id": "68972a10ba52ad84e7f1318d"
            }
        },
        {
            "_id": "68972a04ba52ad84e7f13184",
            "id": "DOCASSIST-6",
            "title": "Issue in inventory check logic",
            "description": "Reference order:#123456#789012There was 2 inventory available for SKU: ABC Partner created the cart with 2 units and successfully placed order.Order created and  2 units being soft allocated now net available inventory is 0 for SKU:ABCThink if partner not able to proceed payment due to payment page error. Now net available inventory becomes zero. so when partner again tries to place order partner cant since the inventory has become zero. Solution: Check inventory during order creation (to soft allocate) but do not check inventory at payment page during the time of partner payment",
            "status": "processed",
            "attachments": [],
            "comments": [
                {
                    "id": "10006",
                    "author": "Soorya Venkat",
                    "body": "Pls confirm if serviceability check is required or not ?",
                    "created": "2025-08-08T00:07:48.337+0530"
                },
                {
                    "id": "10007",
                    "author": "Soorya Venkat",
                    "body": "For partner journey no need to check serviceability check",
                    "created": "2025-08-08T00:08:25.140+0530"
                },
                {
                    "id": "10008",
                    "author": "Soorya Venkat",
                    "body": "QA testing passed for this enhancement hence deploying to PROD",
                    "created": "2025-08-08T00:08:48.155+0530"
                }
            ],
            "jira_status": "Done",
            "type": "Story",
            "createdAt": "2025-08-09T10:59:16.196Z",
            "updatedAt": "2025-08-09T10:59:30.587Z",
            "__v": 0,
            "ai": {
                "type": "Enhancement",
                "summary": "Inventory check logic updated to allow payment without rechecking inventory, preventing soft allocation conflicts.",
                "doc_suggesstion": [],
                "keywords": [
                    "inventory",
                    "soft allocation",
                    "payment"
                ],
                "service": "fulfillment",
                "impact_location": "Order creation and payment processing flow",
                "is_permanent": "permanent",
                "_id": "68972a12ba52ad84e7f1318f"
            }
        },
        {
            "_id": "68972a04ba52ad84e7f13185",
            "id": "DOCASSIST-2",
            "title": "colour change for buy online pick in store orders",
            "description": "Add one more logic for BOPIS (buy online pick up in store) colour change. Apply all usual colour validation. On top of it only for BOPIS orders Check for inventory at the physical store not online inventory, if the physical store inventory is not available then colour change should not be allowed.",
            "status": "processed",
            "attachments": [],
            "comments": [
                {
                    "id": "10001",
                    "author": "Soorya Venkat",
                    "body": "can you please update any other configuration is required for BOPIS ?",
                    "created": "2025-08-07T23:47:59.664+0530"
                },
                {
                    "id": "10002",
                    "author": "Soorya Venkat",
                    "body": "how many times colour change is allowed for BOPIS order ? @business",
                    "created": "2025-08-07T23:48:48.035+0530"
                },
                {
                    "id": "10003",
                    "author": "Soorya Venkat",
                    "body": "we can have max of three time colour change is allowed    ",
                    "created": "2025-08-07T23:49:13.663+0530"
                },
                {
                    "id": "10004",
                    "author": "Soorya Venkat",
                    "body": "can user change colour without login ?",
                    "created": "2025-08-07T23:50:08.965+0530"
                },
                {
                    "id": "10005",
                    "author": "Soorya Venkat",
                    "body": "no user must login to change colour",
                    "created": "2025-08-07T23:50:19.587+0530"
                },
                {
                    "id": "10017",
                    "author": "Gokulakrishnan M",
                    "body": "qa testing completed",
                    "created": "2025-08-09T14:34:42.876+0530"
                }
            ],
            "jira_status": "Done",
            "type": "Story",
            "createdAt": "2025-08-09T10:59:16.196Z",
            "updatedAt": "2025-08-09T10:59:32.358Z",
            "__v": 0,
            "ai": {
                "type": "Enhancement",
                "summary": "Added logic to restrict colour change for BOPIS orders based on physical store inventory availability.",
                "doc_suggesstion": [],
                "keywords": [
                    "BOPIS",
                    "colour_change",
                    "inventory"
                ],
                "service": "fulfillment",
                "impact_location": "BOPIS order processing workflow",
                "is_permanent": "permanent",
                "_id": "68972a14ba52ad84e7f13191"
            }
        }
    ]
}