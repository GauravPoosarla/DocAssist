export default {
    "status": "success",
    "data": [
        {
            "_id": "68970d985770da72092fe19c",
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
            "createdAt": "2025-08-09T08:58:00.229Z",
            "updatedAt": "2025-08-09T08:58:04.165Z",
            "__v": 0,
            "ai": {
                "type": "Enhancement",
                "summary": "Inventory check logic updated to avoid checking inventory during payment processing.",
                "doc_suggesstion": [],
                "keywords": [
                    "inventory",
                    "order",
                    "payment"
                ],
                "service": "fulfillment",
                "impact_location": "Order creation and payment processing",
                "is_permanent": "permanent",
                "_id": "68970d9c5770da72092fe19f"
            }
        }
    ]
}