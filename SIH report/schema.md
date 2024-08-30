### Registering Accounts
1. departments
2. employees
3. officers
4. technical experts

### Departments
1. departments ID
1. name
2. description
3. location
4. head
5. employees[]
6. officers[]
7. technical experts[]
8. projects[]
9. resources[]
10. tasks[]
11. status - `ACTIVE`, `INACTIVE`

### Employees
1. employees ID
1. name
2. email
3. password
3. phone
4. address
5. department
6. status - `ACTIVE`, `INACTIVE`

### Officers
1. officers ID
1. name
2. email
3. password
3. phone
4. address
5. department
6. status - `ACTIVE`, `INACTIVE`

### Technical Experts
1. technical experts ID
1. name
2. email
3. password
4. expertise[]
3. phone
4. address
5. department
6. status - `ACTIVE`, `INACTIVE`


### Projecs
1. projects ID
1. name
2. description
3. location
3. department
4. start date
5. end date
6. status - `ON-GOING`, `COMPLETED`, `REJECTED`, `PLANNING`, `ON-HOLD`
7. budget
8. organization
9. officers[]
10. technical experts[]
11. employees[]


### Resources
1. resources ID
1. name
2. description
3. quqntity
3. type - `HUMAN`, `TECHNICAL`, `DATA`, `OTHER`
4. department
5. status - `AVAILABLE`, `IN-USE`, `REPAIRING`, `DISPOSED`


### Tasks
1. tasks ID
1. name
2. description
3. start date
4. reports[]
5. status - `PENDING`, `IN-PROGRESS`, `COMPLETED`, `REJECTED`
6. departments[]


### reports
1. reports ID
1. name
2. title
2. description
4. date
5. department
