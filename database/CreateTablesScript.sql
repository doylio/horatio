CREATE DATABASE "ShakespearIO"
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- DROP SCHEMA public ;

CREATE SCHEMA public
    AUTHORIZATION postgres;

COMMENT ON SCHEMA public
    IS 'standard public schema';

GRANT ALL ON SCHEMA public TO postgres;

GRANT ALL ON SCHEMA public TO PUBLIC;

-- DROP USER horatio;

CREATE USER horatio WITH
  LOGIN
  NOSUPERUSER
  INHERIT
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION;

-- DROP TABLE public.characters;

CREATE TABLE public.characters
(
    id integer NOT NULL DEFAULT nextval('characters_id_seq'::regclass),
    play_id integer,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    age character varying(255) COLLATE pg_catalog."default",
    gender character varying(255) COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    CONSTRAINT characters_pkey PRIMARY KEY (id),
    CONSTRAINT characters_play_id_fkey FOREIGN KEY (play_id)
        REFERENCES public.plays (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.characters
    OWNER to postgres;

GRANT ALL ON TABLE public.characters TO horatio;

GRANT ALL ON TABLE public.characters TO postgres;


-- DROP TABLE public.monologues;

CREATE TABLE public.monologues
(
    id integer NOT NULL DEFAULT nextval('monologues_id_seq'::regclass),
    character_id integer,
    play_id integer,
    act integer,
    scene integer,
    first_line integer,
    last_line integer,
    CONSTRAINT monologues_pkey PRIMARY KEY (id),
    CONSTRAINT monologue_first_line FOREIGN KEY (first_line, scene, act, play_id)
        REFERENCES public.text (line_no, scene, act, play_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT monologue_last_line FOREIGN KEY (last_line, scene, act, play_id)
        REFERENCES public.text (line_no, scene, act, play_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT monologues_character_id_fkey FOREIGN KEY (character_id)
        REFERENCES public.characters (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.monologues
    OWNER to postgres;

GRANT ALL ON TABLE public.monologues TO horatio;

GRANT ALL ON TABLE public.monologues TO postgres;


-- DROP TABLE public.plays;

CREATE TABLE public.plays
(
    id integer NOT NULL DEFAULT nextval('plays_id_seq'::regclass),
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    year_published character varying(255) COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    CONSTRAINT plays_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.plays
    OWNER to postgres;

GRANT ALL ON TABLE public.plays TO horatio;

GRANT ALL ON TABLE public.plays TO postgres;

-- Table: public.text

-- DROP TABLE public.text;

CREATE TABLE public.text
(
    play_id integer NOT NULL,
    act integer NOT NULL,
    scene integer NOT NULL,
    line_no integer NOT NULL,
    character_id integer,
    line text COLLATE pg_catalog."default",
    CONSTRAINT text_pkey PRIMARY KEY (play_id, act, scene, line_no),
    CONSTRAINT text_character_id_fkey FOREIGN KEY (character_id)
        REFERENCES public.characters (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT text_play_id_fkey FOREIGN KEY (play_id)
        REFERENCES public.plays (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT text_act_check CHECK (act > 0 AND act < 6),
    CONSTRAINT text_scene_check CHECK (scene > 0),
    CONSTRAINT text_line_no_check CHECK (line_no > 0)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.text
    OWNER to postgres;

GRANT ALL ON TABLE public.text TO horatio;

GRANT ALL ON TABLE public.text TO horatio;