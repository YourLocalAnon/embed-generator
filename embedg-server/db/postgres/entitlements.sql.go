// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.22.0
// source: entitlements.sql

package postgres

import (
	"context"
	"database/sql"
	"time"
)

const getActiveEntitlementsForGuild = `-- name: GetActiveEntitlementsForGuild :many
SELECT id, user_id, guild_id, updated_at, deleted, sku_id, starts_at, ends_at FROM entitlements WHERE deleted = false AND (starts_at IS NULL OR starts_at < NOW()) AND (ends_at IS NULL OR ends_at > NOW()) AND guild_id = $1
`

func (q *Queries) GetActiveEntitlementsForGuild(ctx context.Context, guildID sql.NullString) ([]Entitlement, error) {
	rows, err := q.db.QueryContext(ctx, getActiveEntitlementsForGuild, guildID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Entitlement
	for rows.Next() {
		var i Entitlement
		if err := rows.Scan(
			&i.ID,
			&i.UserID,
			&i.GuildID,
			&i.UpdatedAt,
			&i.Deleted,
			&i.SkuID,
			&i.StartsAt,
			&i.EndsAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getActiveEntitlementsForUser = `-- name: GetActiveEntitlementsForUser :many
SELECT id, user_id, guild_id, updated_at, deleted, sku_id, starts_at, ends_at FROM entitlements WHERE deleted = false AND (starts_at IS NULL OR starts_at < NOW()) AND (ends_at IS NULL OR ends_at > NOW()) AND user_id = $1
`

func (q *Queries) GetActiveEntitlementsForUser(ctx context.Context, userID sql.NullString) ([]Entitlement, error) {
	rows, err := q.db.QueryContext(ctx, getActiveEntitlementsForUser, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Entitlement
	for rows.Next() {
		var i Entitlement
		if err := rows.Scan(
			&i.ID,
			&i.UserID,
			&i.GuildID,
			&i.UpdatedAt,
			&i.Deleted,
			&i.SkuID,
			&i.StartsAt,
			&i.EndsAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getEntitlements = `-- name: GetEntitlements :many
SELECT id, user_id, guild_id, updated_at, deleted, sku_id, starts_at, ends_at FROM entitlements
`

func (q *Queries) GetEntitlements(ctx context.Context) ([]Entitlement, error) {
	rows, err := q.db.QueryContext(ctx, getEntitlements)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Entitlement
	for rows.Next() {
		var i Entitlement
		if err := rows.Scan(
			&i.ID,
			&i.UserID,
			&i.GuildID,
			&i.UpdatedAt,
			&i.Deleted,
			&i.SkuID,
			&i.StartsAt,
			&i.EndsAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const upsertEntitlement = `-- name: UpsertEntitlement :one
/*
id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  guild_id TEXT,
  updated_at TIMESTAMP NOT NULL,
  deleted BOOLEAN NOT NULL,
  sku_id TEXT NOT NULL,
  starts_at TIMESTAMP NOT NULL,
  ends_at TIMESTAMP NOT NULL,
  */

INSERT INTO entitlements (id, user_id, guild_id, updated_at, deleted, sku_id, starts_at, ends_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
ON CONFLICT (id) 
DO UPDATE SET deleted = $5, starts_at = $7, ends_at = $8, updated_at = $4
RETURNING id, user_id, guild_id, updated_at, deleted, sku_id, starts_at, ends_at
`

type UpsertEntitlementParams struct {
	ID        string
	UserID    sql.NullString
	GuildID   sql.NullString
	UpdatedAt time.Time
	Deleted   bool
	SkuID     string
	StartsAt  sql.NullTime
	EndsAt    sql.NullTime
}

func (q *Queries) UpsertEntitlement(ctx context.Context, arg UpsertEntitlementParams) (Entitlement, error) {
	row := q.db.QueryRowContext(ctx, upsertEntitlement,
		arg.ID,
		arg.UserID,
		arg.GuildID,
		arg.UpdatedAt,
		arg.Deleted,
		arg.SkuID,
		arg.StartsAt,
		arg.EndsAt,
	)
	var i Entitlement
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.GuildID,
		&i.UpdatedAt,
		&i.Deleted,
		&i.SkuID,
		&i.StartsAt,
		&i.EndsAt,
	)
	return i, err
}
