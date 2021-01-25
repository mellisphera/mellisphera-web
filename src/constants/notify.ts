/* Copyright 2018-present Mellisphera
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */ 



export const NOTIF_MSG = {
        SUCCESS: {
            FR: {
                CHANGE_NAME_DEMO_APIARY: 'Nom modifié',
                READ_ALL_ALERTS_HIVE : 'Alertes lues',
                SAVE_ALERT_CONF: 'Paramètres sauvegardés',
                SEND_MAIL_TEST: 'Email envoyé !'


            },
            EN: {
                CHANGE_NAME_DEMO_APIARY: 'Name updated',
                READ_ALL_ALERTS_HIVE : 'Alerts read',
                SAVE_ALERT_CONF: 'Saved settings',
                SEND_MAIL_TEST: 'Email sent !'

            },
            ES: {
                SEND_MAIL_TEST: 'Email enviado !',
                SAVE_ALERT_CONF: 'Configuraciones guardadas',
            }
        },
        FAIL: {
            FR: {
                AUTH_WRITE_APIARY: 'Vous n\'avez pas le droit de modifier le rucher de démo.',
                NO_DELETE_RIGHT: 'Vous ne pouvez pas supprimer le dernier rucher',
                AUTH_WRITE_HIVE: 'Vous n\'avez pas le droit de modifier cette ruche',
                AUTH_WRITE_NOTES: 'Vous n\'avez pas le droit de modifier les notes de ce rucher',
                AUTH_WRITE_NOTES_HIVE: 'Vous n\'avez pas le droit d\'écrire ici'
            },
            EN: {
                AUTH_WRITE_APIARY: 'You are not allowed to modify the demonstration apiary.',
                NO_DELETE_RIGHT: 'You can\'t delete the last apiary',
                AUTH_WRITE_HIVE: 'You are not allowed to modify this hive',
                AUTH_WRITE_NOTES: 'You are not allowed to write notes in this apiary',
                AUTH_WRITE_NOTES_HIVE: 'You are not allowed to write here'
            }
        }
}
export enum NotifList{
    AUTH_WRITE_APIARY = 'AUTH_WRITE_APIARY',
    NO_DELETE_RIGHT = 'NO_DELETE_RIGHT',
    AUTH_WRITE_HIVE = 'AUTH_WRITE_HIVE',
    CHANGE_NAME_DEMO_APIARY = 'CHANGE_NAME_DEMO_APIARY',
    AUTH_WRITE_NOTES = 'AUTH_WRITE_NOTES',
    AUTH_WRITE_NOTES_HIVE = 'AUTH_WRITE_NOTES_HIVE',
    READ_ALL_ALERTS_HIVE = 'READ_ALL_ALERTS_HIVE',
    SAVE_ALERT_CONF = 'SAVE_ALERT_CONF',
    SEND_MAIL_TEST = 'SEND_MAIL_TEST'

}