"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.role = void 0;
exports.role = [
    {
        _id: 'ADMIN-CB',
        permissions: ['admin-cb'],
        status: 'ACTIVE',
        name: 'Client Billing',
        description: 'Updated',
        company: '5e8723f131c6e53d60ae9678',
    },
    {
        _id: 'ADMIN-CGA',
        permissions: ['admin-cga', 'admin-cla'],
        status: 'ACTIVE',
        name: 'Client Global Admin',
        description: 'Client Global Admin: allow to create/update Client Billing account and Client Local Admin account.',
    },
    {
        _id: 'ADMIN-CLA',
        permissions: ['admin-cla'],
        status: 'ACTIVE',
        name: 'Client Local Admin',
        description: 'Client Local Admin',
    },
    {
        _id: 'ADMIN-CSA',
        permissions: ['admin-csa', 'admin-cga', 'admin-cla'],
        status: 'ACTIVE',
        name: 'Client Super Admin',
        description: 'Client Super Admin: allow to create/update Client Global Admin account.',
    },
    {
        _id: 'ADMIN-SA',
        permissions: ['admin-sa', 'admin-csa', 'admin-cga', 'admin-cla'],
        status: 'ACTIVE',
        name: 'System Admin',
        description: 'System Admin: allow to create/update System Billing account, Client Super Admin account.',
    },
    {
        _id: 'ADMIN-SB',
        permissions: ['admin-sb'],
        status: 'ACTIVE',
        name: 'System Billing',
        description: 'System Billing',
    },
    {
        _id: 'CANDIDATE',
        permissions: [],
        status: 'ACTIVE',
        name: 'candidate',
        description: 'candidate',
    },
    {
        _id: 'CUSTOMER',
        permissions: [],
        status: 'ACTIVE',
        name: 'Customer',
        description: 'Customer',
    },
];
//# sourceMappingURL=role.js.map