import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../api.service';
import { UserData } from '../interfaces/userData';
import { AppData } from '../interfaces/appData';
import { SlidePage } from '../interfaces/slidePage';
import { RollsMapComponent } from '../rolls-map/rolls-map.component';
import { AlertComponent } from '../alert/alert.component';
import { CustomTableComponent } from '../custom-table/custom-table.component';
declare const SLIDEPAGE: any;
declare const GLOBAL: any;
declare const TOAST: any;
@Component({
    selector: 'Users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
    @Input() apps: Array<AppData>;
    constructor(private api: ApiService) {}
    @ViewChild('alert', { static: true }) alert: AlertComponent;
    @ViewChild('alertRemove', { static: true }) alertRemove: AlertComponent;
    @ViewChild('slider', { static: true }) slider: ElementRef;
    @ViewChild('rolls', { static: false }) rolls: RollsMapComponent;
    @ViewChild('table_users', { static: false })
    table_users: CustomTableComponent;

    listApps: Array<AppData>;
    sp: SlidePage;
    showAddUser: boolean = false;
    userForEdit: UserData;
    users: Array<UserData>;
    header: any = [
        ['Nombre', 'firstname', 120],
        ['Apellido', 'lastname', 120],
        ['Email', 'email', 200],
    ];
    dataForm: UserData = {
        active: true,
        note: '',
        legalId: '',
        internalId: '',
    } as any;
    ngOnInit(): void {
        const dashboard: AppData = {
            id: 'dashboard',
            url: 'https://dashboard.nazan.ml',
            color: 'black',
            rolls: ['admin'],
            name: 'dashboard',
            code: 'dashboard',
            xstore: false,
            selfroll: true,
            active: true,
        };
        this.listApps = [...[dashboard], ...this.apps];

        this.sp = new SLIDEPAGE({
            el: this.slider.nativeElement,
            repeat: false, // default: false
            realNumber: false, // default: false
            direction: 'x', // default: x
            display: 'grid', // default: block
            transition: 300, // default: 250,
            pages: '.pageUser', // default sp_page
        });
        this.api.getUsers().then((users: Array<UserData>) => {
            this.users = users;
        });
    }
    resetDataForm() {
        this.dataForm = {
            active: true,
            note: '',
            legalId: '',
            internalId: '',
        } as any;
    }
    openAddUser() {
        console.log('entra aqui');
        // this.dataForm = {} as any;
        this.resetDataForm();
        this.userForEdit = null;
        this.showAddUser = true;
        this.sp.go(0);
    }
    next() {
        this.sp.next();
    }
    back() {
        this.sp.prev();
    }
    changeInput = (value: string, id: string) => {
        this.dataForm[id] = value;
    };
    done() {
        if (
            !['lastname', 'email', 'firstname'].every((x) => this.dataForm[x])
        ) {
            TOAST.add('Faltan algunos datos necesarios');
            this.sp.go(0);
            return;
        }
        this.userForEdit ? this.editUser() : this.createUser();
    }
    editUser() {
        GLOBAL.loading(true, 'Modificando usuario');
        this.api
            .updateUser(
                Object.assign(this.dataForm, {
                    privileges: this.rolls.getRolls(),
                })
            )
            .then((users: Array<UserData>) => {
                this.showAddUser = false;
                this.userForEdit = null;
                this.users = users;
                TOAST.add('Se ha actualizado el usuario correctamente');
                this.sp.go(0);
                this.alert.close();
            })
            .finally(() => GLOBAL.loading(false));
    }
    createUser() {
        // verificar contraseña
        if (this.dataForm.pass.length < 6) {
            TOAST.add('la contraseña debe tener al menos 6 caracteres');
            this.sp.go(0);
            return;
        }
        if (this.dataForm.pass !== this.dataForm['pass2']) {
            TOAST.add('Las contraseñas no coinciden');
            this.sp.go(0);
            return;
        }

        GLOBAL.loading(true, 'Creando usuario');
        this.api
            .createUser(
                Object.assign(this.dataForm, {
                    privileges: this.rolls.getRolls(),
                })
            )
            .then((r: Array<UserData>) => {
                this.users = r;
                this.showAddUser = false;
                TOAST.add('Se ha registrado el usuario correctamente');
            })
            .finally(() => GLOBAL.loading(false));
    }
    onSelectUser = ([user]: Array<UserData>) => {
        if (!user) return;
        // this.dataForm = {} as any;
        this.resetDataForm();
        this.userForEdit = null;

        const onCloseAlert = () => this.table_users.unSelect();

        this.alert.open(`Usuario: ${user ? user.email : ''}`, [
            {
                name: 'Editar',
                color: 'blue',
                action: () => {
                    console.log(user);
                    onCloseAlert();
                    this.userForEdit = Object.assign({}, user);
                    this.dataForm = this.userForEdit;
                    this.sp.go(0);
                    this.showAddUser = true;
                },
            },
            {
                name: 'Eliminar',
                color: 'red',
                close: false,
                action: () => {
                    this.alertRemove.open('Desea eliminar al usuario ?', () => {
                        GLOBAL.loading(true, 'Eliminando usuario');
                        this.api
                            .removeUser(user.id)
                            .then((users: Array<UserData>) => {
                                this.users = users;
                                TOAST.add('Se ha elimiado el usuario');
                                onCloseAlert();
                                this.alert.close();
                            })
                            .finally(() => GLOBAL.loading(false));
                    });
                },
            },
            {
                name: 'Cerrar',
                color: '#fda789',
                action: () => {
                    onCloseAlert();
                },
            },
        ]);
    };
}
