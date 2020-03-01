create table if not exists notes (

id serial primary key,
title varchar(127) NOT NULL,
content text NOT NULL,
created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
ddel smallint default 0

)