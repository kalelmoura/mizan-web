# Mizan API

REST API contract for the Mizan clinical trial patient-matching backend. The web frontend (`mizan-web`) is built against this spec.

**Base URL:** `http://localhost:8000/api/v1`  
**Auth:** `Authorization: Bearer <token>` (coordinator session)  
**Content-Type:** `application/json`

---

## Enums

| Name | Values |
|------|--------|
| `CriterionStatus` | `passed`, `failed`, `needs_screening`, `not_evaluated` |
| `CriterionType` | `inclusion`, `exclusion` |
| `MatchStatus` | `screening`, `pending_review`, `recommended`, `not_recommended` |
| `MatchRecommendation` | `pending`, `refer_for_screening`, `enroll`, `do_not_enroll` |
| `TrialStatus` | `recruiting`, `active`, `completed`, `suspended` |

---

## Patients

### `GET /patients`

List patients available for trial matching.

**Query parameters**

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Filter by name or MRN |
| `page` | integer | Page number (default `1`) |
| `limit` | integer | Page size (default `20`, max `100`) |

**Response `200`**

```json
{
  "data": [Patient],
  "meta": { "page": 1, "limit": 20, "total": 42 }
}
```

### `GET /patients/:patientId`

**Response `200`:** `Patient`  
**Response `404`:** `{ "error": "patient_not_found" }`

---

## Trials

### `GET /trials`

List clinical trials.

**Query parameters**

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Filter by title, condition, or NCT ID |
| `status` | TrialStatus | Filter by recruitment status |
| `page` | integer | Page number (default `1`) |
| `limit` | integer | Page size (default `20`) |

**Response `200`**

```json
{
  "data": [Trial],
  "meta": { "page": 1, "limit": 20, "total": 12 }
}
```

### `GET /trials/:trialId`

**Response `200`:** `Trial`  
**Response `404`:** `{ "error": "trial_not_found" }`

---

## Matches

A **match** is a patient–trial recommendation with eligibility criteria breakdown and audit history.

### `GET /matches`

**Query parameters**

| Param | Type | Description |
|-------|------|-------------|
| `patientId` | uuid | Filter by patient |
| `trialId` | uuid | Filter by trial |
| `status` | MatchStatus | Filter by match status |
| `page` | integer | Page number |
| `limit` | integer | Page size |

**Response `200`**

```json
{
  "data": [Match],
  "meta": { "page": 1, "limit": 20, "total": 8 }
}
```

### `POST /matches`

Run eligibility screening for a patient against one or more trials.

**Request body**

```json
{
  "patientId": "uuid",
  "trialIds": ["uuid"],
  "runBy": "coordinator@site.org"
}
```

**Response `201`**

```json
{
  "data": [Match]
}
```

### `GET /matches/:matchId`

Returns match with embedded criteria summary.

**Response `200`:** `MatchDetail`  
**Response `404`:** `{ "error": "match_not_found" }`

### `PATCH /matches/:matchId`

Update coordinator decision on a match.

**Request body**

```json
{
  "status": "recommended",
  "recommendation": "enroll",
  "notes": "All inclusion criteria met after lab review."
}
```

**Response `200`:** `Match`  
Creates an audit event for each changed field.

---

## Criteria

Per-criterion eligibility evaluation on a match.

### `GET /matches/:matchId/criteria`

**Response `200`**

```json
{
  "data": [CriterionEvaluation]
}
```

### `PATCH /matches/:matchId/criteria/:criterionId`

Update screening outcome for a single criterion.

**Request body**

```json
{
  "status": "passed",
  "evidence": "HbA1c 7.2% on 2026-06-12",
  "notes": "Confirmed via chart review"
}
```

**Response `200`:** `CriterionEvaluation`  
Creates an audit event. May recalculate `Match.criteriaSummary` and `confidenceScore`.

---

## Audit trail

Immutable log of every change to a patient–trial recommendation.

### `GET /matches/:matchId/audit`

**Query parameters**

| Param | Type | Description |
|-------|------|-------------|
| `page` | integer | Page number |
| `limit` | integer | Page size (default `50`) |

**Response `200`**

```json
{
  "data": [AuditEvent],
  "meta": { "page": 1, "limit": 50, "total": 14 }
}
```

### `GET /audit`

Global audit feed across all matches (coordinator dashboard).

**Query parameters:** `matchId`, `actor`, `from`, `to`, `page`, `limit`

**Response `200`:** Same paginated `AuditEvent` list.

---

## Schemas

### Patient

```json
{
  "id": "uuid",
  "mrn": "MRN-10482",
  "firstName": "Elena",
  "lastName": "Vasquez",
  "dateOfBirth": "1968-03-14",
  "sex": "female",
  "conditions": ["Type 2 diabetes", "Hypertension"],
  "lastScreenedAt": "2026-07-08T14:22:00Z"
}
```

### Trial

```json
{
  "id": "uuid",
  "nctId": "NCT05234567",
  "title": "Phase III SGLT2 Inhibitor in T2D with CKD",
  "phase": "Phase III",
  "status": "recruiting",
  "condition": "Type 2 Diabetes Mellitus",
  "sponsor": "Acme Pharma",
  "inclusionCount": 8,
  "exclusionCount": 12
}
```

### Match

```json
{
  "id": "uuid",
  "patientId": "uuid",
  "trialId": "uuid",
  "status": "pending_review",
  "recommendation": "pending",
  "confidenceScore": 72,
  "criteriaSummary": {
    "passed": 5,
    "failed": 1,
    "needsScreening": 2,
    "notEvaluated": 0
  },
  "createdAt": "2026-07-08T10:00:00Z",
  "updatedAt": "2026-07-08T14:22:00Z",
  "recommendedBy": null
}
```

### MatchDetail

`Match` plus denormalized patient/trial labels for display:

```json
{
  "...Match fields",
  "patient": { "id": "uuid", "mrn": "MRN-10482", "displayName": "Elena Vasquez" },
  "trial": { "id": "uuid", "nctId": "NCT05234567", "title": "Phase III SGLT2..." }
}
```

### CriterionEvaluation

```json
{
  "id": "uuid",
  "matchId": "uuid",
  "type": "inclusion",
  "ordinal": 3,
  "text": "HbA1c between 7.0% and 10.5%",
  "status": "needs_screening",
  "evidence": null,
  "evaluatedAt": null,
  "evaluatedBy": null,
  "notes": null
}
```

### AuditEvent

```json
{
  "id": "uuid",
  "matchId": "uuid",
  "actor": "Dr. Sarah Chen",
  "action": "criterion_updated",
  "entityType": "criterion",
  "entityId": "uuid",
  "previousValue": "needs_screening",
  "newValue": "passed",
  "notes": "HbA1c 7.2% confirmed",
  "timestamp": "2026-07-08T14:22:00Z"
}
```

---

## Error responses

All errors return:

```json
{
  "error": "error_code",
  "message": "Human-readable description"
}
```

| Status | Code | When |
|--------|------|------|
| 400 | `validation_error` | Invalid request body or query |
| 401 | `unauthorized` | Missing or invalid token |
| 404 | `not_found` | Resource does not exist |
| 409 | `conflict` | Invalid state transition |
| 500 | `internal_error` | Unexpected server failure |

---

## Frontend integration

| Env variable | Default | Purpose |
|--------------|---------|---------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000/api/v1` | Backend base URL |
| `NEXT_PUBLIC_USE_MOCK_API` | `true` in development | Serve mock data when backend is unavailable |

When `NEXT_PUBLIC_USE_MOCK_API=true`, the frontend uses in-memory fixtures that conform to this contract.
