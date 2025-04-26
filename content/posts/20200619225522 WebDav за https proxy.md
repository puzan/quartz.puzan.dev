---
aliases:
  - WebDav за https proxy
tags: self-hosted
title: WebDav за https proxy
created: 2020-06-19T22:55:22+03:00
modified: 2025-04-25T22:10:14+03:00
---

Регулярно читаю различную литературу. Зачастую в _pdf_ формате. _Pdf_ книги читаю через [GoodReader](https://www.goodreader.com) на _iPad_ (_liara_). Постоянно отмечаю и комментирую текст через аннотации, которые сохраняются непосредственно в pdf файл. А для синхронизации книжек использую _webdav_, настроенный на домашнем сервере с помощью _nginx_. Ранее все крутилось почти на голом _CubieBoard_ (_edi2_), а теперь на _HP MicroServer_ (_edi3_) в контейнерах. В скобках указаны имена девайсов в моей локальной сети. Называю железки по именам героев из _Mass Effect_. _edi3_ — это уже третья реинкарнация моего центрального домашнего сервера.

Как-то раз я задумал скрыть все сервисы, запущенные на сервере за proxy. Задача proxy сводится к распределению трафика на основе имени домена и поддержке _https_. Внутренний (фактически межконтейнерный) трафик остается нешифрованным. Изначально роль proxy выполнял _nginx_. На нем же был настроен _webdav_ для книг. Но достаточно быстро я перешел на [_Fabio_][fabio]. Решение судя по всему не сильно популярное, но гибкое и динамичное. Работает примерно так:

- Настройки задаются в labels контейнеров
- [*Registrator*](https://github.com/gliderlabs/registrator) копирует информацию в [_consul_][consul]
- [_Fabio_][fabio] читает данные из [_consul_][consul] и строит Routing Table. Обновления динамические, ничего ребутать или релоудить не надо.

Вот пример кусочка `docker-compose` для [*gitea*](https://gitea.io):

```yml
services:
  gitea:
    image: gitea/gitea:1.11
    labels:
      SERVICE_3000_NAME: gitea
      SERVICE_3000_CHECK_HTTP: /api/v1/version
      SERVICE_3000_CHECK_INTERVAL: 15s
      SERVICE_3000_TAGS: urlprefix-gitea.puzan.info:443/
      SERVICE_22_NAME: gitea-ssh
      SERVICE_22_CHECK_TCP: true
      SERVICE_22_CHECK_INTERVAL: 15s
      SERVICE_22_TAGS: urlprefix-:2222 proto=tcp
```

Вернемся к _webdav_. В этой схеме _webdav_ переехал в отдельный _nginx_ (80 порт в контейнере), доступ к которому осуществляется через [_fabio_][fabio] через _https_ (443 порт на _edi3_). Ничего не предвещало беды, но я столкнулся вот с такой ошибкой во время обновления файлов (_nginx_ лог):

```
read_1 | 172.21.0.7 - puzan [18/Jun/2020:20:49:46 +0000] "PROPFIND /current/ HTTP/1.1" 207 2657 "-" "GoodReader"
read_1 | 172.21.0.7 - puzan [18/Jun/2020:20:49:46 +0000] "PUT /current/temp1 HTTP/1.1" 201 0 "-" "GoodReader"
read_1 | 2020/06/18 20:49:46 [error] 6#6: *7 client sent invalid "Destination" header: "https://read.puzan.info/current/some_book.pdf", client: 172.21.0.7, server: www.read.puzan.info, request: "MOVE /current/temp1 HTTP/1.1", host: "read.puzan.info"
read_1 | 172.21.0.7 - puzan [18/Jun/2020:20:49:46 +0000] "MOVE /current/temp1 HTTP/1.1" 400 173 "-" "GoodReader"
```

Как видно сначала происходит поиск файлов через `PROPFIND`. Затем выполняется `PUT` обновленного файла во временный файл `/current/temp1`. Дальше выполняется попытка `MOVE`. Но `MOVE` выполняется для `Destination="https://read.puzan.info/…"`. И как видно _nginx_ ничего не знает про _https_ сервис. Тут встает вопрос почему _GoodReader_ не использует относительные пути. Но это немного другая история, которая не поддается быстрому исправлению.

Починить проблему на серверной стороне (без поднятия внутренней _https_ точки) помогает модуль [Headers More](https://www.nginx.com/resources/wiki/modules/headers_more/). Суть фикса заключается в том, чтобы переписать значение `Destination` заголовка c `https://…`, на `http://…`. _Nginx_ конфиг для _webdav_ теперь у меня выглядит примерно так:

```nginx
server {
    listen 80;
    server_name www.read.puzan.info read.puzan.info;

    location / {
        # Rewrite destination header if it starts with https
        set $destination $http_destination;
        if ($destination ~ ^https://(.+)) {
            set $destination http://$1;
            more_set_input_headers "Destination: $destination";
        }

        root /data/read;

        dav_methods PUT DELETE MKCOL COPY MOVE;
        dav_ext_methods PROPFIND OPTIONS;
    }
}
```

Установка модуля в _debian_:

```
apt-get install -y nginx libnginx-mod-http-headers-more-filter
```

Использую базовый образ _debian_ в контейнере для webdav, чтобы не искать и собирать нужные _nginx_ модули (тут есть еще зависимость на `dav_ext_module`). Изначально пробовал _alpine_, но быстро сдался.

---

PS. Решение было найдено на каком-то китайском форуме (ссылку потерял уже), который вывел на [идею с перезаписью заголовка](https://serverfault.com/questions/901325/how-to-rewrite-webdav-http-destination-request-header-on-nginx).

[fabio]: https://fabiolb.net
[consul]: https://www.consul.io
