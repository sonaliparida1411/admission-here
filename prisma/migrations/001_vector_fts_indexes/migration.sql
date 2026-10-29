-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create vector domain if not present
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vector') THEN 
    CREATE DOMAIN vector AS double precision[]; 
  END IF; 
END $$;

-- 1. Full-Text Search (tsvector) Auto-update Trigger for College
CREATE OR REPLACE FUNCTION college_search_tsv_trigger() RETURNS trigger AS $$
BEGIN
  new."searchTsv" :=
    setweight(to_tsvector('english', coalesce(new."name", '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new."shortName", '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new."city", '')), 'B') ||
    setweight(to_tsvector('english', coalesce(new."state", '')), 'B') ||
    setweight(to_tsvector('english', coalesce(new."overviewHtml", '')), 'C');
  return new;
END
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_college_search_tsv ON "College";
CREATE TRIGGER trg_college_search_tsv
  BEFORE INSERT OR UPDATE OF "name", "shortName", "city", "state", "overviewHtml"
  ON "College"
  FOR EACH ROW
  EXECUTE FUNCTION college_search_tsv_trigger();

-- 2. Full-Text Search (tsvector) Auto-update Trigger for BlogPost
CREATE OR REPLACE FUNCTION blog_search_tsv_trigger() RETURNS trigger AS $$
BEGIN
  new."searchTsv" :=
    setweight(to_tsvector('english', coalesce(new."title", '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new."metaTitle", '')), 'B') ||
    setweight(to_tsvector('english', coalesce(new."metaDescription", '')), 'B') ||
    setweight(to_tsvector('english', coalesce(new."contentMdx", '')), 'C');
  return new;
END
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_blog_search_tsv ON "BlogPost";
CREATE TRIGGER trg_blog_search_tsv
  BEFORE INSERT OR UPDATE OF "title", "metaTitle", "metaDescription", "contentMdx"
  ON "BlogPost"
  FOR EACH ROW
  EXECUTE FUNCTION blog_search_tsv_trigger();

-- 3. GIN Full-Text Search Indexes
CREATE INDEX IF NOT EXISTS idx_colleges_search_tsv ON "College" USING GIN ("searchTsv");
CREATE INDEX IF NOT EXISTS idx_blogs_search_tsv ON "BlogPost" USING GIN ("searchTsv");

-- 4. Trigram Fuzzy Search Indexes
CREATE INDEX IF NOT EXISTS idx_colleges_name_trgm ON "College" USING GIN ("name" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_colleges_city_trgm ON "College" USING GIN ("city" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_courses_slug_trgm ON "Course" USING GIN ("slug" gin_trgm_ops);

