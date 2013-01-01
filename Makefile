-include config.mk

.PHONY: all clean

NAME=flowerui
SRC=$(wildcard *.js)
TESTHTM=$(patsubst %.rhtm,%.htm,$(wildcard test/*.rhtm))

all: dist/$(NAME).js dist/$(NAME).css $(TESTHTM)

dist/$(NAME).js: $(NAME).js $(NAME).moddef $(SRC)
	mkdir -p dist
	"$(RAINY_PATH)/rain" --moddef "$(JSLIBS_PATH)/base.js/base.moddef" --moddef "$(JSLIBS_PATH)/flower.js/flower.moddef" --moddef "$(NAME).moddef" --incpath ".." --incpath "$(JSLIBS_PATH)" $< > $@

test/%.htm: test/%.rhtm
	"$(RAINY_PATH)/rain" --moddef "$(JSLIBS_PATH)/base.js/base.moddef" --moddef "$(JSLIBS_PATH)/flower.js/flower.moddef" --moddef "$(NAME).moddef" --incpath ".." --incpath "$(JSLIBS_PATH)" --type html $< > $@

dist/$(NAME).css: dialog.css arrows.css
	mkdir -p dist
	cat $^ > $@

clean:
	rm -f dist/$(NAME).js dist/$(NAME).css
