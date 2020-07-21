export const NOTIF_DESCRIPTION5 = {
    FR: {
        Honeydew: "Déclenchée lorsque l'apport de poids dans la ruche dépasse le seuil choisi lors de la dernière semaine.",
        Rain : "Déclenchée lorsque les précipitations pluvieuses dépassent le seuil choisi le prochain jour.",
        Swarm: "Déclenchée lorsque un potentiel essaimage est survenu (un Hub offre plus d'efficacité).",
        DConnect :"Déclenchée lorsqu'un de vos capteurs ne transmet plus de données (ou ponctuellement) pendant chaque période choisie. Ne fonctionne qu'avec un Hub.",
        Tmax: "Déclenchée lorsque la température interne dépasse le seuil choisi.",
        Tmin: "Déclenchée lorsque la température interne est en dessous du seuil choisi.",
        LowBrood: "Déclenchée quand le pourcentage de couvain est en dessous du seuil défini.",
        StopWeather: "Déclenchée lorsque votre station météo s'arrête d'émettre des données. Nécessite sa propre station météo.",
        Rswarm: "Déclenchée lorsque le risque d'essaimage est fort sur une de vos ruches le prochain jour. ",
        WIpos: "Déclenchée lorsque le poids entrants de la journée dans la ruche dépasse le seuil choisi.",
        WIneg: "Déclenchée lorsque les abeilles consomment beaucoup plus de ressources qu'elles n'en ramènent dans la ruche. Le seuil de perte est réglable.",
        Wlim: "Déclenchée lorsque le seuil de poids indiqué est dépassé pour une de vos ruches.",
        Snow: "Déclenchée lorsque les précipitations neigeuses dépassent le seuil choisi le prochain jour.",
        Wind: "Déclenchée lorsque le vent dépassent le seuil choisi le prochain jour.",
        ColdDay: "Déclenchée lorsqu'une journée froide à venir est détectée, c’est-à-dire en dessous du seuil de température indiqué.",
        HotDay:"Déclenchée lorsqu'une journée chaude à venir est détectée, c’est-à-dire au dessus du seuil de température indiqué.",
        Hmin: "Déclenchée lorsque l'humidité interne est en dessous du seuil choisi.",
        Hmax: "Déclenchée lorsque l'humidité interne dépasse le seuil choisi.",
        Stolen: "Déclenchée lorsque le poids de votre ruche devient anormalement faible.",
        DConnectT: 'Déclenchée lorsque votre capteur de température ne transmets plus de données durant le dernier jour.',
        DConnectW: 'Déclenchée lorsque votre capteur de poids ne transmets plus de données durant le dernier jour.',
        DConnectH: 'Déclenchée lorsque votre Hub ne transmets plus de données durant le dernier jour.',
        PoorSignalW: 'Déclenchée lorsque votre capteur de poids transmets peu de données durant le dernier jour.',
        PoorSignalT: 'Déclenchée lorsque votre capteur de température transmets peu de données durant le dernier jour.',
        LowBatteryW: 'Déclenchée lorsque le niveau de batterie de votre capteur de poids est en dessous du seuil choisi.',
        LowBatteryT: 'Déclenchée lorsque le niveau de batterie de votre capteur de température est en dessous du seuil choisi.',
        'Super+': 'A partir de l’analyse du poids de votre ruche, nous avons constaté que vous avez ajouté une hausse.',
        'Super-': 'A partir de l’analyse du poids de votre ruche, nous avons constaté que vous avez retiré une hausse.',
        Oxalic: 'Déclenchée lorsque le couvain moyen de vos ruches est en dessous du seuil fixé. C’est une indication vous permettant de traiter vos ruches à l’acide oxalique au bon moment.',
        Dead: 'Notre algorithme détecte chaque jour si votre ruche est morte en fonction de différents paramètres que nous avons fixés.'
    },
    EN: {
        Honeydew: "Triggered when the weight contribution to the hive exceeds the chosen threshold during the last week.",
        Rain : "Triggered when rainfall exceeds the chosen threshold on the next day.",
        Swarm: "Triggered when a potential swarm has occurred (Hub offers more efficiency).",
        DConnect :"Triggered when one of your sensors no longer transmits data (or punctually) during each chosen period. Only works with a Hub.",
        Tmax: "Triggered when the internal temperature exceeds the chosen threshold.",
        Tmin: "Triggered when the internal temperature is below the chosen threshold.",
        LowBrood: "Triggered when the percentage of brood is below the chosen threshold.",
        LowBattery: "Triggered when the percentage of battery is below the chosen threshold.",
        StopWeather: "Triggered when your weather station stops transmitting data. Requires its own weather station.",
        Rswarm: "Triggered when the risk of swarm is high on one of your hives on the next day.",
        WIpos: "Triggered when the incoming weight of the day in the hive exceeds the chosen threshold.",
        WIneg: "Triggered when bees consume many more resources than they bring back to the hive. The loss threshold is adjustable.",
        Wlim: "Triggered when the indicated weight threshold is exceeded for one of your hives.",
        Snow: "Triggered when snowfall exceeds the chosen threshold on the next day.",
        Wind: "Triggered when the wind exceeds the chosen threshold on the next day.",
        ColdDay: "Triggered when an upcoming cold day is detected, i.e. below the specified temperature threshold.",
        HotDay: "Triggered when an upcoming hot day is detected, i.e. above the specified temperature threshold.",
        Hmin: "Triggered when the internal humidity is below the chosen threshold.",
        Hmax: "Triggered when the internal humidity exceeds the chosen threshold.",
        Stolen: "Triggered when the weight of your hive becomes abnormally low. ",
        DConnectT: 'Triggered when your T sensor no longer transmits data during the last day.',
        DConnectW: 'Triggered when your W sensor no longer transmits data during the last day.',
        DConnectH: 'Triggered when your Hub no longer transmits data during the last day.',
        PoorSignalW: 'Triggered when your W sensor transmits little data during the last day.',
        PoorSignalT: 'Triggered when your T sensor transmits little data during the last day. ',
        LowBatteryW: 'Triggered when the battery level of your W sensor is below the selected threshold.',
        LowBatteryT: 'Triggered when the battery level of your T sensor is below the selected threshold.',
        'Super+': 'From the analysis of the weight of your hive, we found that you have added a super.',
        'Super-': 'From the analysis of the weight of your hive, we found that you have removed a super.',
        Oxalic: 'Triggered when the average brood in your hives is below the set threshold. This is an indication that allows you to treat your hives with oxalic acid at the right time.',
        Dead: 'Our algorithm detects every day if your hive is dead based on various parameters we have set.'

    },
    ES: {
        Honeydew: 'Ganancia de peso sobre 7 dias superior al umbral.',
        Rain: 'Precipitaciones en las proximas 24h superiores al umbral.',
        Swarm: 'Posible enjambrazon à partir de sensores W y T2 (un Hub ofrece mayor precision).',
        DConnect: 'Uno de los sensores no transmite datos o lo hace de manera esporadica, durante el período seleccionado (necesita un Hub).',
        Tmax: 'Temperatura interna superior al umbral.',
        Tmin: 'Temperatura interna inferior al umbral.',
        LowBrood: 'Nivel de cría por debajo del umbral.',
        LowBattery: 'Nivel de batería por debajo del umbral.',
        StopWeather: 'Estación meteorológica interrumpe la transmision de datos. Requiere su propia estación meteorológica.',
        Rswarm: 'Alto riesgo de enjambrazón en las proximas 24h.',
        WIpos: 'Aporte de recursos diario superior al umbral.',
        WIneg: 'Consumo de recursos excesivo o pillaje superior al umbral.',
        Wlim: "Se activa cuando se supera el umbral de peso indicado para una de sus colmenas.",
        Snow: 'Nevada superior al umbral en las proximas 24h.',
        Wind: 'Viento superior al umbral en las proximas 24h.',
        ColdDay: 'Se activa cuando se detecta un próximo día frío, es decir, por debajo del umbral de temperatura especificado.',
        HotDay: 'Se activa cuando se detecta un día caluroso por delante, es decir, por encima del umbral de temperatura especificado.',
        Hmin: 'Humedad interna por debajo del umbral seleccionado.',
        Hmax: 'Humedad interna por encima del umbral seleccionado.',
        Stolen: 'Evolución anormal del peso de la colmena, por debajo del umbral.',
        DConnectT: 'Se activa cuando su sensor de temperatura ya no transmite datos durante el último día.',
        DConnectW: 'Se activa cuando su sensor de peso ya no transmite datos durante el último día.',
        DConnectH: 'Se activa cuando su Hub ya no transmite datos durante el último día.',
        PoorSignalW: 'Se activa cuando tu sensor de peso transmite pocos datos durante el último día.',
        PoorSignalT: 'Se activa cuando su sensor de temperatura transmite pocos datos durante el último día.',
        LowBatteryW: 'Se activa cuando el nivel de la batería de su sensor de peso está por debajo del umbral seleccionado.',
        LowBatteryT: 'Se activa cuando el nivel de la batería de su sensor de temperatura está por debajo del umbral seleccionado.',
        'Super+': 'A partir del análisis del peso de su colmena, encontramos que ha añadido una alza.',
        'Super-': 'A partir del análisis del peso de su colmena, encontramos que ha eliminado una subida.',
        Oxalic: 'Se desencadena cuando el promedio de cría en sus colmenas está por debajo del umbral establecido. Esta es una indicación que le permite tratar sus colmenas con ácido oxálico en el momento adecuado.',
        Dead: 'Nuestro algoritmo detecta cada día si su colmena está muerta basándose en diferentes parámetros que hemos establecido.'

    }
}