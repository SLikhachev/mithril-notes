-- Postgrest sql notes table 
create table if not exists notes (

id serial primary key,
title varchar(127) NOT NULL,
content text NOT NULL,
created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
completed timestamp with time zone,
ddel smallint default 0
)