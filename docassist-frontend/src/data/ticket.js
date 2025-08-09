export default {
    "status": "success",
    "ticket": {
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
    "suggested_docs": [
        {
            "id": "720929",
            "title": "Pament Integration",
            "link": "https://samsunghack.atlassian.net/wiki/spaces/DOC/pages/720929"
        },
        {
            "id": "688132",
            "title": "GST Details Collection in Checkout Flow for B2B E-commerce",
            "link": "https://samsunghack.atlassian.net/wiki/spaces/DOC/pages/688132"
        },
        {
            "id": "753695",
            "title": "Checkout Flow",
            "link": "https://samsunghack.atlassian.net/wiki/spaces/DOC/pages/753695"
        }
    ]
}