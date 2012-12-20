-include config.mk

.PHONY: all clean

NAME=flowerui

all: $(NAME).js $(NAME).css

dist/$(NAME).js: $(NAME).js $(NAME).moddef
	mkdir -p dist
	"$(RAINY_PATH)/rain" --moddef "$(JSLIBS_PATH)/base.js/base.moddef" --moddef "$(JSLIBS_PATH)/flower.js/flower.moddef" --moddef "$(NAME).moddef" --incpath ".." --incpath "$(JSLIBS_PATH)" $< > $@

dist/$(NAME).css: dialog.css arrows.css
	mkdir -p dist
	cat $^ > $@

clean:
	rm -f dist/$(NAME).js dist/$(NAME).css
