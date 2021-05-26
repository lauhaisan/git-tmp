"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VietNamPolicy = {
    country: 'VietNam',
    countryId: 'VN',
    timeOffSetting: {
        timeoffType: [
            {
                name: 'Annual Leave',
                type: 'A',
                shortType: 'CL',
                typeName: 'Paid Leaves',
                description: 'Day la mot cai dádfádfaescription boi vi phai co description',
                policyDoc: '5f4cca095ba1233d0c61815f',
                baseAccrual: {
                    time: 0,
                    date: '',
                    unlimited: false,
                },
                tenureAccrual: [
                    {
                        yearOfEmployment: 0,
                        totalLeave: 0,
                        date: 'AM',
                        effectiveFrom: '',
                    },
                ],
                accrualSchedule: {
                    accrualFrequency: '',
                    timeofAccrual: '',
                    startDate: '',
                    useHireDateAnniversaries: 'false',
                },
                maxBalance: {
                    notGreaterThan: 0,
                    date: 'Day',
                    unlimited: 'true',
                },
                negativeBalance: {
                    unto: 0,
                    date: '',
                    unlimited: 'false',
                },
                annualReset: {
                    date: '20/01/2020',
                    resetAnnually: 'false',
                },
                carryoverCap: {
                    uptownAmount: 0,
                    date: '',
                    effectiveFrom: '',
                    unlimited: 'false',
                },
                waitingPeriod: {
                    afterAmount: 0,
                    date: '',
                    accrue: 'false',
                },
                minIncrements: {
                    min: 0,
                    date: 'AM',
                    notImpose: 'false',
                },
                hireProbation: {
                    newHire: 'false',
                },
            },
            {
                name: 'Sick Leave',
                type: 'A',
                shortType: 'CL',
                typeName: 'Paid Leaves',
                description: 'Day la mot cai dádfádfaescription boi vi phai co description',
                policyDoc: '5f4cca095ba1233d0c61815f',
                baseAccrual: {
                    time: 8,
                    date: '',
                    unlimited: false,
                },
                tenureAccrual: [
                    {
                        yearOfEmployment: 0,
                        totalLeave: 0,
                        date: 'AM',
                        effectiveFrom: '',
                    },
                ],
                accrualSchedule: {
                    accrualFrequency: '',
                    timeofAccrual: '',
                    startDate: '',
                    useHireDateAnniversaries: 'false',
                },
                maxBalance: {
                    notGreaterThan: 8,
                    date: 'Day',
                    unlimited: 'true',
                },
                negativeBalance: {
                    unto: 65,
                    date: '',
                    unlimited: 'false',
                },
                annualReset: {
                    date: '20/01/2020',
                    resetAnnually: 'false',
                },
                carryoverCap: {
                    uptownAmount: 0,
                    date: '',
                    effectiveFrom: '',
                    unlimited: 'false',
                },
                waitingPeriod: {
                    afterAmount: 0,
                    date: '',
                    accrue: 'false',
                },
                minIncrements: {
                    min: 0,
                    date: 'AM',
                    notImpose: 'false',
                },
                hireProbation: {
                    newHire: 'false',
                },
            },
            {
                name: 'fasdf Leave',
                type: 'A',
                shortType: 'CL',
                typeName: 'Paid Leaves',
                description: 'Day la mot cai dádfádfaescription boi vi phai co description',
                policyDoc: '5f4cca095ba1233d0c61815f',
                baseAccrual: {
                    time: 8,
                    date: '',
                    unlimited: false,
                },
                tenureAccrual: [
                    {
                        yearOfEmployment: 0,
                        totalLeave: 0,
                        date: 'AM',
                        effectiveFrom: '',
                    },
                ],
                accrualSchedule: {
                    accrualFrequency: '',
                    timeofAccrual: '',
                    startDate: '',
                    useHireDateAnniversaries: 'false',
                },
                maxBalance: {
                    notGreaterThan: 8,
                    date: 'Day',
                    unlimited: 'true',
                },
                negativeBalance: {
                    unto: 65,
                    date: '',
                    unlimited: 'false',
                },
                annualReset: {
                    date: '20/01/2020',
                    resetAnnually: 'false',
                },
                carryoverCap: {
                    uptownAmount: 0,
                    date: '',
                    effectiveFrom: '',
                    unlimited: 'false',
                },
                waitingPeriod: {
                    afterAmount: 0,
                    date: '',
                    accrue: 'false',
                },
                minIncrements: {
                    min: 0,
                    date: 'AM',
                    notImpose: 'false',
                },
                hireProbation: {
                    newHire: 'false',
                },
            },
        ],
        employeeSchedule: {
            totalHour: 8,
            startWorkDay: {
                start: '8:00',
                amPM: 'AM',
            },
            endWorkDay: {
                end: '17:00',
                amPM: 'PM',
            },
            workDay: [
                { date: 'MONDAY', checked: true },
                { date: 'TUESDAY', checked: true },
                { date: 'WEDNESDAY', checked: true },
                { date: 'THURSDAY', checked: true },
                { date: 'FRIDAY', checked: true },
                { date: 'SATURDAY', checked: true },
                { date: 'SUNDAY', checked: true },
            ],
        },
        holidayCalendar: [
            {
                name: 'le gi do',
                range: {
                    start: '1/1/2020',
                    end: '1/1/2020',
                    year: 2020,
                    total: 1,
                },
                type: 'Restricted Holiday',
            },
            {
                name: 'gsfgs',
                range: {
                    start: '1/1/2020',
                    end: '1/1/2020',
                    year: 2020,
                    total: 1,
                },
                type: 'Restricted Holiday',
            },
            {
                name: 'rtw',
                range: {
                    start: '1/1/2020',
                    end: '1/1/2020',
                    year: 2020,
                    total: 1,
                },
                type: 'Restricted Holiday',
            },
            {
                name: 'werwr',
                range: {
                    start: '1/1/2020',
                    end: '1/1/2020',
                    year: 2020,
                    total: 1,
                },
                type: 'Restricted Holiday',
            },
        ],
        manageBalance: [
            {
                type: 'SWITCH',
                attachment: '5fe94769a020a235503b30e5',
                effectiveDate: '2020-12-31T02:25:07.065Z',
            },
        ],
    },
};
exports.default = VietNamPolicy;
//# sourceMappingURL=countryPolicy.js.map